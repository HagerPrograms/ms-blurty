import { Request, Response } from "express"
import prisma from "../../utils/prisma"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { keyBy } from 'lodash'

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


class AnalyticsController {
    async GetTrendingPosts(req: Request, _res: Response) {
        const trendingPosts = await prisma.pOSTS.findMany({
            where: {
                parent_post_id: null
            },
            orderBy: {
                created_on: 'desc'
            },
            take: 5
        })
        return trendingPosts
    }
    //find schools with the most posts
    async GetMostPosts(req: Request, _res: Response) {
      const mostPostsQuery: mostPost[] = await prisma.$queryRaw`
      SELECT s.id, s.name, COUNT(p.id) as post_count
      FROM "SCHOOLS" s
      LEFT JOIN "POSTS" p ON p."school_id" = s.id AND p."parent_post_id" IS NULL
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
        SELECT post_id,
        COUNT(*) as total_reactions,
        SUM(CASE WHEN r."reaction_type" = 'like' THEN 1 ELSE 0 END) as likes,
        SUM(CASE WHEN r."reaction_type" = 'dislike' THEN 1 ELSE 0 END) as dislikes
        FROM "REACTIONS" r
        GROUP BY post_id
        ORDER BY total_reactions DESC
        LIMIT 5;
      `
      const mostReactedToData = mostReactionToQuery.map(post => {
        return {
          postId: Number(post.post_id),
          totalReactions: post.total_reaction,
          likes: post.likes,
          dislikes: post.dislikes
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


    async GetAnalytics (req: Request, res: Response){
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