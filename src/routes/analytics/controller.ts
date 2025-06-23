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
  post_count: bigint 
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


class AnalyticsController {
    
  async GetTrendingPosts(req: Request, _res: Response) {
    const trendingPosts: TrendingPosts[] = await prisma.$queryRaw`
      SELECT 
        p.*, 
        COUNT(r.id) AS reaction_count
      FROM "POSTS" p
      LEFT JOIN "REACTIONS" r 
        ON p."id" = r."post_id" 
        AND r."created_on" >= NOW() - INTERVAL '24 hours'
      WHERE p."parent_post_id" IS NULL 
        AND p."logical_delete_indicator" = false
      GROUP BY p."id"
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
        SELECT s.id, s.name, COUNT(p.id) as post_count
        FROM "SCHOOLS" s
        LEFT JOIN "POSTS" p ON p."school_id" = s.id AND p."parent_post_id" IS NULL
        WHERE p."logical_delete_indicator" = false
        GROUP BY s.id
        ORDER BY post_count DESC
        LIMIT 5
      `

    const mostPostsData: {name: string, postCount: number}[] = mostPostsQuery.map((post: mostPost) => {
      return {
        name: post.name,
        postCount: Number(post.post_count)
      }
    })

    return mostPostsData
    }

    async GetMostReplies(req: Request, _res: Response) { 
      const mostRepliesQuery: mostPost[] = await prisma.$queryRaw`
      SELECT s.id, s.name, COUNT(p.id) as post_count
      FROM "SCHOOLS" s
      LEFT JOIN "POSTS" p ON p."school_id" = s.id AND p."parent_post_id" IS NOT NULL
      WHERE p."logical_delete_indicator" = false
      GROUP BY s.id
      ORDER BY post_count DESC
      LIMIT 5
    `

    const mostPostsData: {name: string, postCount: number}[] = mostRepliesQuery.map((reply: mostPost) => {
      return {
        name: reply.name,
        postCount: Number(reply.post_count)
      }
    })

    return mostPostsData
    }

    async GetMostReactedTo(req: Request, _res: Response) {
      const mostReactionToQuery: mostReactedTo[] = await prisma.$queryRaw`
        SELECT 
          r.post_id,
          COUNT(*) AS total_reactions,
          SUM(CASE WHEN r."reaction_type" = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN r."reaction_type" = 'dislike' THEN 1 ELSE 0 END) AS dislikes
        FROM "REACTIONS" r
        JOIN "POSTS" p ON r."post_id" = p."id"
        WHERE p."logical_delete_indicator" = false
        GROUP BY r.post_id
        ORDER BY total_reactions DESC
        LIMIT 5;
      `
      const mostReactedToData = mostReactionToQuery.map(post => {
        return {
          postId: Number(post.post_id),
          totalReactions: Number(post.total_reaction),
          likes: Number(post.likes),
          dislikes: Number(post.dislikes)
        }
      })

      return mostReactedToData
    }

    async GetTotalPostsMade(req: Request, _res: Response) {
      const today = dayjs().utc().startOf('day').toDate()
      const fiveDaysAgo = dayjs(today).utc().subtract(5, 'day').toDate()

      const totalBeforeFiveDays = await prisma.pOSTS.count({
        where: {
          created_on: {
            lt: fiveDaysAgo,
          },
        },
      });

      const dailyPostCounts: {date: string, count: bigint}[] = await prisma.$queryRaw`
        SELECT
          DATE("created_on") as date,
          COUNT(*) as count
          FROM "POSTS"
          WHERE "created_on" >= CURRENT_DATE - INTERVAL '4 days'
          GROUP BY DATE("created_on")
          ORDER BY date ASC;`;

      const deltaMap = keyBy(dailyPostCounts.map((date) => ({...date, date: dayjs(date.date).utc().toISOString()})), 'date')
      const dates = [
        dayjs(today).utc().subtract(5, 'day').toISOString(),
        dayjs(today).utc().subtract(4, 'day').toISOString(),
        dayjs(today).utc().subtract(3, 'day').toISOString(),
        dayjs(today).utc().subtract(2, 'day').toISOString(),
        dayjs(today).utc().subtract(1, 'day').toISOString(),
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
        const mostReactedTo = await this.GetMostReactedTo(req, res)
        const totalPostsMade = await this.GetTotalPostsMade(req, res)

        return {
          trendingPosts,
          mostPosts,
          mostReplies,
          mostReactedTo,
          totalPostsMade
        }
    }
}
export default new AnalyticsController