import NodeCache from "node-cache"
import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { keyBy } from 'lodash'
import { TRENDING_STATES } from "../../utils/constants"
const trendingCache = new NodeCache();



dayjs.extend(utc)

interface mostPost { 
  id: number, 
  name: string, 
  postCount: bigint 
}

interface mostReactedTo {
  post_id: number,
  total_reaction: number,
  likes: number
  dislikes: number
}

interface TrendingPosts {
  "id": number,
  "text": string
  "created_on": string,
  "media_url": string,
  "logical_delete_indicator": boolean,
  "parent_post_id": number | null,
  "school_id": number,
  "author_id": number,
  "reaction_count": number
}

interface TrendingPostsWithDirection {
  "id": number,
  "text": string
  "created_on": string,
  "media_url": string,
  "logical_delete_indicator": boolean,
  "parent_post_id": number | null,
  "school_id": number,
  "author_id": number,
  "reaction_count": number
  "trending_state": 0|1|2|null
}

declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this);
};


class AnalyticsController {
    
  async GetTrendingPosts(req: Request, _res: Response) {
    const trendingPosts: TrendingPosts[] = await prisma.$queryRaw`
      SELECT 
        p.*,
        s.name as school_name,
        s.abbreviation as school_abbreviation,
        COALESCE(r.reaction_count, 0) AS reaction_count
      FROM "POSTS" p
      LEFT JOIN (
        SELECT post_id, COUNT(id) AS reaction_count
        FROM "REACTIONS"
        WHERE created_on >= NOW() - INTERVAL '24 hours'
        GROUP BY post_id
      ) r ON r.post_id = p.id
      LEFT JOIN "SCHOOLS" s ON p.school_id = s.id
      WHERE p.parent_post_id IS NULL 
        AND p.logical_delete_indicator = false
      ORDER BY reaction_count DESC
      LIMIT 10;

      `
      const cache = trendingCache?.get<TrendingPostsWithDirection[]>('trending') ?? []
      
      //compares prev cached state to new retrieved state, and determines direction
      const trendingStates = cache.map((post: TrendingPostsWithDirection, prevIndex: number) => {
        const currIndex = trendingPosts.findIndex(element => element.id === post.id)
        const state: 0|1|2|null  = currIndex > prevIndex ?
          TRENDING_STATES.DOWN :
          currIndex < prevIndex ?
          TRENDING_STATES.UP :
          currIndex === prevIndex && post.trending_state !== null ? 
          post.trending_state :
          TRENDING_STATES.NONE
        return {state, post: post.id}
      })

      //key by post id
      const trendingStateMap = keyBy(trendingStates, 'post')

      //create symmeterical data
      const data: TrendingPostsWithDirection[] = trendingPosts.map((post: TrendingPosts) => {
        return {
          ...post,
          reaction_count: Number(post.reaction_count),
          trending_state: trendingStateMap?.[post.id]?.state ?? null
        }
      })

      //set data in cache
      trendingCache.set("trending", data)

      return data
    }

    async GetMostPosts(req: Request, _res: Response) {
      const mostPostsQuery: mostPost[] = await prisma.$queryRaw`
        SELECT s.*, COUNT(p.id) as postCount
        FROM "SCHOOLS" s
        LEFT JOIN "POSTS" p ON p."school_id" = s.id AND p."parent_post_id" IS NULL
        WHERE p."logical_delete_indicator" = false
        GROUP BY s.id
        ORDER BY postCount DESC
        LIMIT 5
      `

    const mostPostsData = mostPostsQuery.map((post: mostPost) => {
      return {
        ...post
      }
    })

    return mostPostsData
    }

    async GetMostReplies(req: Request, _res: Response) { 
      const mostRepliesQuery: mostPost[] = await prisma.$queryRaw`
      SELECT s.*, COUNT(p.id) as postCount
      FROM "SCHOOLS" s
      LEFT JOIN "POSTS" p ON p."school_id" = s.id AND p."parent_post_id" IS NOT NULL
      WHERE p."logical_delete_indicator" = false
      GROUP BY s.id
      ORDER BY postCount DESC
      LIMIT 5
    `

    const mostReplies = mostRepliesQuery.map((reply: mostPost) => {
      return {
        ...reply
      }
    })

    return mostReplies
    }

    async mostDisliked(req: Request, _res: Response) {
      const mostReactionToQuery: mostReactedTo[] = await prisma.$queryRaw`
        SELECT 
          s."abbreviation",
          COUNT(*) AS dislike_count
        FROM "REACTIONS" r
        JOIN "POSTS" p ON r."post_id" = p."id"
        JOIN "SCHOOLS" s ON p."school_id" = s."id"
        WHERE r."reaction_type" = 'dislike'
          AND r."created_on" >= NOW() - INTERVAL '30 days'
        GROUP BY s."abbreviation"
        ORDER BY dislike_count DESC
        LIMIT 5
      `
      const mostReactedToData = mostReactionToQuery.map(post => {
        return {
          ...post,
        }
      })

      return mostReactedToData
    }

    async GetTotalPostsMade(req: Request, _res: Response) {
      const today = dayjs().utc().startOf('day').toDate()
      const fiveWeeksAgo = dayjs(today).utc().subtract(5, 'week').toDate()

      const totalBeforeFiveDays = await prisma.pOSTS.count({
        where: {
          created_on: {
            lt: fiveWeeksAgo,
          },
        },
      });

      const dailyPostCounts: {date: string, count: bigint}[] = await prisma.$queryRaw`
        SELECT
          DATE("created_on") as date,
          COUNT(*) as count
          FROM "POSTS"
          WHERE "created_on" >= CURRENT_DATE - INTERVAL '4 weeks'
          GROUP BY DATE("created_on")
          ORDER BY date ASC;`;

      const deltaMap = keyBy(dailyPostCounts.map((date) => ({...date, date: dayjs(date.date).utc().toISOString()})), 'date')
      const dates = [
        dayjs(today).utc().subtract(5, 'week').toISOString(),
        dayjs(today).utc().subtract(4, 'week').toISOString(),
        dayjs(today).utc().subtract(3, 'week').toISOString(),
        dayjs(today).utc().subtract(2, 'week').toISOString(),
        dayjs(today).utc().subtract(1, 'week').toISOString(),
      ]
      let acc = 0 
      const changeMap = dates.map((date) => {
        if(deltaMap[date]){
          acc += Number(deltaMap[date].count)
        }
        return {
          date,
          posts: totalBeforeFiveDays + acc
        }
      })
      return changeMap
    }


    async GetAnalytics (req: Request, res: Response) {
        const trendingPosts = await this.GetTrendingPosts(req, res)
        const mostPosts = await this.GetMostPosts(req, res)
        const mostReplies = await this.GetMostReplies(req, res)
        const mostDisliked = await this.mostDisliked(req, res)
        const totalPostsMade = await this.GetTotalPostsMade(req, res)

        return {
          trendingPosts,
          mostPosts,
          mostReplies,
          mostDisliked,
          totalPostsMade
        }
    }
}
export default new AnalyticsController