import { gql } from '@apollo/client'
import { AnyJson, EntityTag, TagTargetType, UserMedia } from '../../types'

export const FRAGMENT_ENTITY_TAG = gql`
  fragment EntityTagFields on EntityTag {
    id
    targetId
    climbName
    areaName
    ancestors
    type
    topoData
  }
`

export const FRAGMENT_MEDIA_WITH_TAGS = gql`
  ${FRAGMENT_ENTITY_TAG}
 fragment MediaWithTagsFields on MediaWithTags {
    id
    username
    mediaUrl
    width
    height
    uploadTime
    entityTags {
      ... EntityTagFields
    }
  }`

export interface AddEntityTagProps {
  mediaId: string
  entityId: string
  entityType: TagTargetType
  topoData?: AnyJson
}

/**
 * Return type for Add entity mutation
 */
export interface AddEntityTagMutationReturn {
  addEntityTag: EntityTag
}

/**
 * Create a media <--> climb (or area) association
 * {mediaId: "645aa64261c73112fc19b4fd", entityId: "a5364f01-4d10-5e35-98eb-e58f2c613ce4", entityType: 0
 */
export const MUTATION_ADD_ENTITY_TAG = gql`
  ${FRAGMENT_ENTITY_TAG}
  mutation addEntityTag($mediaId: ID!, $entityId: ID!, $entityType: Int!, $topoData: JSONObject) {
    addEntityTag(
      input: {
        mediaId: $mediaId,
        entityId: $entityId,
        entityType: $entityType
        topoData: $topoData
      }
    ) {
        ... EntityTagFields
    }
  }`

export interface RemoveEntityTagMutationProps {
  mediaId: string
  tagId: string
}

/**
 * Return type for remove entity tag mutation
 */
export interface RemoveEntityTagMutationReturn {
  removeEntityTag: boolean
}

export const MUTATION_REMOVE_ENTITY_TAG = gql`
  mutation removeEntityTag($mediaId: ID!, $tagId: ID!) {
    removeEntityTag(
      input: {
        mediaId: $mediaId,
        tagId: $tagId
      }
    )
  }`

/**
 * Query one media by id
 */
export const QUERY_MEDIA_BY_ID = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query media($id: ID!) {
    media(input: { id: $id }) {
      ... MediaWithTagsFields
    }
  }
`

export const QUERY_MEDIA_FOR_FEED = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ($maxUsers: Int, $maxFiles: Int) {
    getMediaForFeed(input: { maxUsers: $maxUsers, maxFiles: $maxFiles }) {
      username
      userUuid
      mediaWithTags {
        ... MediaWithTagsFields
      }
    }
  }
`

export interface GetMediaForwardQueryReturn {
  getUserMediaPagination: UserMedia
}

export const QUERY_USER_MEDIA = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query UserMedia($userUuid: ID!, $first: Int, $after: ID) {
    getUserMediaPagination(
      input: { userUuid: $userUuid, first: $first, after: $after }
    ) {
      userUuid
      mediaConnection {
        edges {
          cursor
          node {
            ... MediaWithTagsFields
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`
