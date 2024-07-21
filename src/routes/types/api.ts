export interface GetPostsResponse {
    id: number,
    name: string,
    abbreviation: string,
    state_id: number,
    POSTS: Post[]
}

export interface Post {
    id: number,
    text: string,
    created_on: string | null,
    media_url: string | null,
    logical_delete_indicator: boolean,
    parent_post_id: number | null,
    school_id: number,
    author_id: number,
    REACTIONS?: Reaction[],
    other_POSTS?: Post[]
}

export interface Reaction {
    id: number,
    user_id: number,
    post_id: number,
    reaction_type: "like" | "dislike",
    created_on: string
}