import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date;
  /** Any type */
  Json: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JsonObject: Record<string, any>;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export type Annotation = {
  __typename: 'Annotation';
  author?: Maybe<User>;
  commentsCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  quote: Scalars['String'];
  target: Scalars['Json'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type AnnotationCreateInput = {
  quote: Scalars['String'];
  target: Scalars['Json'];
  text: Scalars['String'];
};

export type Comment = {
  __typename: 'Comment';
  annotationId: Scalars['ID'];
  author?: Maybe<User>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type CommentCreateInput = {
  annotation: Scalars['ID'];
  text: Scalars['String'];
};

export type Group = {
  __typename: 'Group';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  members: Array<User>;
  name: Scalars['String'];
  token: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type GroupCreateInput = {
  name: Scalars['String'];
};

export type GroupUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type IdentifierType = {
  __typename: 'IdentifierType';
  id: Scalars['ID'];
};

export type Lecture = {
  __typename: 'Lecture';
  createdAt: Scalars['DateTime'];
  group?: Maybe<Group>;
  id: Scalars['ID'];
  name: Scalars['String'];
  owner: User;
  participants: Array<User>;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
};

export type LectureCreateInput = {
  name: Scalars['String'];
  url: Scalars['String'];
};

export type LectureUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Message = {
  __typename: 'Message';
  author?: Maybe<User>;
  createdAt: Scalars['DateTime'];
  groupId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  parent?: Maybe<Message>;
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type MessageConnection = {
  __typename: 'MessageConnection';
  edges: Array<MessageEdge>;
  nodes: Array<Message>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MessageCreateInput = {
  group?: InputMaybe<Scalars['ID']>;
  parentMessage?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
};

export type MessageEdge = {
  __typename: 'MessageEdge';
  cursor: Scalars['String'];
  node: Message;
};

export type Mutation = {
  __typename: 'Mutation';
  createAnnotation: Annotation;
  createComment: Comment;
  createGroup: Group;
  createLecture: Lecture;
  deleteAnnotation: SuccessType;
  deleteLecture: SuccessType;
  deleteProfile: SuccessType;
  joinGroup: Group;
  joinLecture: Lecture;
  kickParticipant: SuccessType;
  leaveGroup: Group;
  leaveLecture: SuccessType;
  login: Token;
  logout: SuccessType;
  refreshLogin: Token;
  register: User;
  sendMessage: Message;
  updateGroup: Group;
  updateLecture: Lecture;
  updateProfile: User;
};


export type MutationCreateAnnotationArgs = {
  input: AnnotationCreateInput;
};


export type MutationCreateCommentArgs = {
  input: CommentCreateInput;
};


export type MutationCreateGroupArgs = {
  input: GroupCreateInput;
};


export type MutationCreateLectureArgs = {
  input: LectureCreateInput;
};


export type MutationDeleteAnnotationArgs = {
  id: Scalars['ID'];
};


export type MutationJoinGroupArgs = {
  token: Scalars['String'];
};


export type MutationJoinLectureArgs = {
  lectureId: Scalars['ID'];
  url: Scalars['String'];
};


export type MutationKickParticipantArgs = {
  id: Scalars['ID'];
};


export type MutationLeaveGroupArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSendMessageArgs = {
  input: MessageCreateInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID'];
  input: GroupUpdateInput;
};


export type MutationUpdateLectureArgs = {
  input: LectureUpdateInput;
};


export type MutationUpdateProfileArgs = {
  input: ProfileInput;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type ProfileInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  bio?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  deleteAvatar?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename: 'Query';
  annotations: Array<Annotation>;
  comments: Array<Comment>;
  group: Group;
  groupMembers: Array<User>;
  lecture: Lecture;
  me: User;
  messages: MessageConnection;
  participants: Array<User>;
};


export type QueryCommentsArgs = {
  annotationId: Scalars['ID'];
};


export type QueryGroupMembersArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  group?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type RegisterInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  bio?: InputMaybe<Scalars['String']>;
  color: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename: 'Subscription';
  annotationWasCreated: Annotation;
  annotationWasRemoved: IdentifierType;
  commentWasAdded: Comment;
  groupMemberJoined: User;
  groupMemberLeft: User;
  groupWasUpdated: Group;
  lectureWasUpdated: Lecture;
  messageWasSent: Message;
  participantJoined: User;
  participantLeft: User;
  userWasRemoved: IdentifierType;
  userWasUpdated: User;
};


export type SubscriptionCommentWasAddedArgs = {
  annotationId?: InputMaybe<Scalars['ID']>;
};


export type SubscriptionGroupMemberJoinedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionGroupMemberLeftArgs = {
  id: Scalars['ID'];
};


export type SubscriptionGroupWasUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionLectureWasUpdatedArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type SubscriptionMessageWasSentArgs = {
  groupId?: InputMaybe<Scalars['ID']>;
};

export type SuccessType = {
  __typename: 'SuccessType';
  success: Scalars['Boolean'];
};

export type Token = {
  __typename: 'Token';
  accessToken: Scalars['String'];
  accessTokenExpiresAt: Scalars['DateTime'];
  user: User;
};

export type User = {
  __typename: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  bio: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  isInstructor: Scalars['Boolean'];
  isStudent: Scalars['Boolean'];
  name: Scalars['String'];
  profileColor: Scalars['String'];
  role: UserRole | `${UserRole}`;
  updatedAt: Scalars['DateTime'];
};

export enum UserRole {
  Instructor = 'Instructor',
  Student = 'Student'
}

export type AnnotationFragment = { __typename: 'Annotation', id: string, createdAt: Date, quote: string, text: string, target: any, commentsCount: number, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined };

export type CommentFragment = { __typename: 'Comment', id: string, annotationId: string, text: string, createdAt: Date, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined };

export type GroupFragment = { __typename: 'Group', id: string, createdAt: Date, name: string, token: string };

export type LectureFragment = { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } };

export type MessageFragment = { __typename: 'Message', id: string, createdAt: Date, updatedAt: Date, text: string, groupId?: string | undefined, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined, parent?: { __typename: 'Message', id: string, text: string } | undefined };

export type UserFragment = { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean };

export type CreateAnnotationMutationVariables = Exact<{
  quote: Scalars['String'];
  text: Scalars['String'];
  target: Scalars['Json'];
}>;


export type CreateAnnotationMutation = { __typename: 'Mutation', createAnnotation: { __typename: 'Annotation', id: string, createdAt: Date, quote: string, text: string, target: any, commentsCount: number, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined } };

export type CreateCommentMutationVariables = Exact<{
  annotationId: Scalars['ID'];
  text: Scalars['String'];
}>;


export type CreateCommentMutation = { __typename: 'Mutation', createComment: { __typename: 'Comment', id: string, annotationId: string, text: string, createdAt: Date, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined } };

export type DeleteAnnotationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAnnotationMutation = { __typename: 'Mutation', deleteAnnotation: { __typename: 'SuccessType', success: boolean } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename: 'Mutation', login: { __typename: 'Token', accessToken: string, accessTokenExpiresAt: Date, user: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename: 'Mutation', logout: { __typename: 'SuccessType', success: boolean } };

export type RefreshLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshLoginMutation = { __typename: 'Mutation', refreshLogin: { __typename: 'Token', accessToken: string, accessTokenExpiresAt: Date } };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  bio?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  color: Scalars['String'];
  avatar?: InputMaybe<Scalars['Upload']>;
}>;


export type RegisterMutation = { __typename: 'Mutation', register: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateGroupMutation = { __typename: 'Mutation', createGroup: { __typename: 'Group', id: string, createdAt: Date, name: string, token: string } };

export type JoinGroupMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type JoinGroupMutation = { __typename: 'Mutation', joinGroup: { __typename: 'Group', id: string, createdAt: Date, name: string, token: string } };

export type LeaveGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LeaveGroupMutation = { __typename: 'Mutation', leaveGroup: { __typename: 'Group', id: string } };

export type UpdateGroupMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateGroupMutation = { __typename: 'Mutation', updateGroup: { __typename: 'Group', id: string, createdAt: Date, name: string, token: string } };

export type CreateLectureMutationVariables = Exact<{
  name: Scalars['String'];
  url: Scalars['String'];
}>;


export type CreateLectureMutation = { __typename: 'Mutation', createLecture: { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } } };

export type DeleteLectureMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteLectureMutation = { __typename: 'Mutation', deleteLecture: { __typename: 'SuccessType', success: boolean } };

export type JoinLectureMutationVariables = Exact<{
  id: Scalars['ID'];
  url: Scalars['String'];
}>;


export type JoinLectureMutation = { __typename: 'Mutation', joinLecture: { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } } };

export type KickParticipantMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type KickParticipantMutation = { __typename: 'Mutation', kickParticipant: { __typename: 'SuccessType', success: boolean } };

export type LeaveLectureMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveLectureMutation = { __typename: 'Mutation', leaveLecture: { __typename: 'SuccessType', success: boolean } };

export type UpdateLectureMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type UpdateLectureMutation = { __typename: 'Mutation', updateLecture: { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } } };

export type SendMessageMutationVariables = Exact<{
  text: Scalars['String'];
  parentMessage?: InputMaybe<Scalars['ID']>;
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type SendMessageMutation = { __typename: 'Mutation', sendMessage: { __typename: 'Message', id: string, createdAt: Date, updatedAt: Date, text: string, groupId?: string | undefined, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined, parent?: { __typename: 'Message', id: string, text: string } | undefined } };

export type DeleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfileMutation = { __typename: 'Mutation', deleteProfile: { __typename: 'SuccessType', success: boolean } };

export type UpdateProfileMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['Upload']>;
  deleteAvatar?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateProfileMutation = { __typename: 'Mutation', updateProfile: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type AnnotationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AnnotationsQuery = { __typename: 'Query', annotations: Array<{ __typename: 'Annotation', id: string, createdAt: Date, quote: string, text: string, target: any, commentsCount: number, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined }> };

export type CommentsQueryVariables = Exact<{
  annotationId: Scalars['ID'];
}>;


export type CommentsQuery = { __typename: 'Query', comments: Array<{ __typename: 'Comment', id: string, annotationId: string, text: string, createdAt: Date, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type GroupQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupQuery = { __typename: 'Query', group: { __typename: 'Group', id: string, createdAt: Date, name: string, token: string } };

export type GroupMembersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GroupMembersQuery = { __typename: 'Query', groupMembers: Array<{ __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean }> };

export type LectureQueryVariables = Exact<{ [key: string]: never; }>;


export type LectureQuery = { __typename: 'Query', lecture: { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } } };

export type ParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type ParticipantsQuery = { __typename: 'Query', participants: Array<{ __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean }> };

export type MessagesQueryVariables = Exact<{
  groupId?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type MessagesQuery = { __typename: 'Query', messages: { __typename: 'MessageConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | undefined, hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | undefined }, nodes: Array<{ __typename: 'Message', id: string, createdAt: Date, updatedAt: Date, text: string, groupId?: string | undefined, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined, parent?: { __typename: 'Message', id: string, text: string } | undefined }> } };

export type AnnotationWasCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AnnotationWasCreatedSubscription = { __typename: 'Subscription', annotationWasCreated: { __typename: 'Annotation', id: string, createdAt: Date, quote: string, text: string, target: any, commentsCount: number, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined } };

export type AnnotationWasRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AnnotationWasRemovedSubscription = { __typename: 'Subscription', annotationWasRemoved: { __typename: 'IdentifierType', id: string } };

export type CommentWasAddedSubscriptionVariables = Exact<{
  annotationId?: InputMaybe<Scalars['ID']>;
}>;


export type CommentWasAddedSubscription = { __typename: 'Subscription', commentWasAdded: { __typename: 'Comment', id: string, annotationId: string, text: string, createdAt: Date, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined } };

export type GroupMemberJoinedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GroupMemberJoinedSubscription = { __typename: 'Subscription', groupMemberJoined: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type GroupMemberLeftSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GroupMemberLeftSubscription = { __typename: 'Subscription', groupMemberLeft: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type GroupWasUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GroupWasUpdatedSubscription = { __typename: 'Subscription', groupWasUpdated: { __typename: 'Group', id: string, createdAt: Date, name: string, token: string } };

export type LectureWasUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LectureWasUpdatedSubscription = { __typename: 'Subscription', lectureWasUpdated: { __typename: 'Lecture', id: string, createdAt: Date, name: string, url: string, owner: { __typename: 'User', id: string, name: string } } };

export type ParticipantJoinedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ParticipantJoinedSubscription = { __typename: 'Subscription', participantJoined: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type ParticipantLeftSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ParticipantLeftSubscription = { __typename: 'Subscription', participantLeft: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export type MessageWasSentSubscriptionVariables = Exact<{
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type MessageWasSentSubscription = { __typename: 'Subscription', messageWasSent: { __typename: 'Message', id: string, createdAt: Date, updatedAt: Date, text: string, groupId?: string | undefined, author?: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } | undefined, parent?: { __typename: 'Message', id: string, text: string } | undefined } };

export type UserWasRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserWasRemovedSubscription = { __typename: 'Subscription', userWasRemoved: { __typename: 'IdentifierType', id: string } };

export type UserWasUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserWasUpdatedSubscription = { __typename: 'Subscription', userWasUpdated: { __typename: 'User', id: string, email: string, name: string, bio: string, avatarUrl?: string | undefined, profileColor: string, isInstructor: boolean, isStudent: boolean } };

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  name
  bio
  avatarUrl
  profileColor
  isInstructor
  isStudent
}
    `;
export const AnnotationFragmentDoc = gql`
    fragment Annotation on Annotation {
  id
  createdAt
  quote
  text
  target
  author {
    ...User
  }
  commentsCount
}
    `;
export const CommentFragmentDoc = gql`
    fragment Comment on Comment {
  id
  annotationId
  text
  createdAt
  author {
    ...User
  }
}
    `;
export const GroupFragmentDoc = gql`
    fragment Group on Group {
  id
  createdAt
  name
  token
}
    `;
export const LectureFragmentDoc = gql`
    fragment Lecture on Lecture {
  id
  createdAt
  name
  url
  owner {
    id
    name
  }
}
    `;
export const MessageFragmentDoc = gql`
    fragment Message on Message {
  id
  createdAt
  updatedAt
  text
  author {
    ...User
  }
  parent {
    id
    text
  }
  groupId
}
    `;
export const CreateAnnotationDocument = gql`
    mutation CreateAnnotation($quote: String!, $text: String!, $target: Json!) {
  createAnnotation(input: {quote: $quote, text: $text, target: $target}) {
    ...Annotation
  }
}
    ${AnnotationFragmentDoc}
${UserFragmentDoc}`;

export function useCreateAnnotationMutation() {
  return Urql.useMutation<CreateAnnotationMutation, CreateAnnotationMutationVariables>(CreateAnnotationDocument);
};
export const CreateCommentDocument = gql`
    mutation CreateComment($annotationId: ID!, $text: String!) {
  createComment(input: {annotation: $annotationId, text: $text}) {
    ...Comment
  }
}
    ${CommentFragmentDoc}
${UserFragmentDoc}`;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const DeleteAnnotationDocument = gql`
    mutation DeleteAnnotation($id: ID!) {
  deleteAnnotation(id: $id) {
    success
  }
}
    `;

export function useDeleteAnnotationMutation() {
  return Urql.useMutation<DeleteAnnotationMutation, DeleteAnnotationMutationVariables>(DeleteAnnotationDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    accessToken
    accessTokenExpiresAt
    user {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RefreshLoginDocument = gql`
    mutation RefreshLogin {
  refreshLogin {
    __typename
    accessToken
    accessTokenExpiresAt
  }
}
    `;

export function useRefreshLoginMutation() {
  return Urql.useMutation<RefreshLoginMutation, RefreshLoginMutationVariables>(RefreshLoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $bio: String, $password: String!, $color: String!, $avatar: Upload) {
  register(
    input: {name: $name, email: $email, bio: $bio, password: $password, color: $color, avatar: $avatar}
  ) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const CreateGroupDocument = gql`
    mutation CreateGroup($name: String!) {
  createGroup(input: {name: $name}) {
    ...Group
  }
}
    ${GroupFragmentDoc}`;

export function useCreateGroupMutation() {
  return Urql.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument);
};
export const JoinGroupDocument = gql`
    mutation JoinGroup($token: String!) {
  joinGroup(token: $token) {
    ...Group
  }
}
    ${GroupFragmentDoc}`;

export function useJoinGroupMutation() {
  return Urql.useMutation<JoinGroupMutation, JoinGroupMutationVariables>(JoinGroupDocument);
};
export const LeaveGroupDocument = gql`
    mutation LeaveGroup($id: ID!) {
  leaveGroup(id: $id) {
    id
  }
}
    `;

export function useLeaveGroupMutation() {
  return Urql.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument);
};
export const UpdateGroupDocument = gql`
    mutation UpdateGroup($id: ID!, $name: String) {
  updateGroup(id: $id, input: {name: $name}) {
    ...Group
  }
}
    ${GroupFragmentDoc}`;

export function useUpdateGroupMutation() {
  return Urql.useMutation<UpdateGroupMutation, UpdateGroupMutationVariables>(UpdateGroupDocument);
};
export const CreateLectureDocument = gql`
    mutation CreateLecture($name: String!, $url: String!) {
  createLecture(input: {name: $name, url: $url}) {
    ...Lecture
  }
}
    ${LectureFragmentDoc}`;

export function useCreateLectureMutation() {
  return Urql.useMutation<CreateLectureMutation, CreateLectureMutationVariables>(CreateLectureDocument);
};
export const DeleteLectureDocument = gql`
    mutation DeleteLecture {
  deleteLecture {
    success
  }
}
    `;

export function useDeleteLectureMutation() {
  return Urql.useMutation<DeleteLectureMutation, DeleteLectureMutationVariables>(DeleteLectureDocument);
};
export const JoinLectureDocument = gql`
    mutation JoinLecture($id: ID!, $url: String!) {
  joinLecture(lectureId: $id, url: $url) {
    ...Lecture
  }
}
    ${LectureFragmentDoc}`;

export function useJoinLectureMutation() {
  return Urql.useMutation<JoinLectureMutation, JoinLectureMutationVariables>(JoinLectureDocument);
};
export const KickParticipantDocument = gql`
    mutation KickParticipant($userId: ID!) {
  kickParticipant(id: $userId) {
    success
  }
}
    `;

export function useKickParticipantMutation() {
  return Urql.useMutation<KickParticipantMutation, KickParticipantMutationVariables>(KickParticipantDocument);
};
export const LeaveLectureDocument = gql`
    mutation LeaveLecture {
  leaveLecture {
    success
  }
}
    `;

export function useLeaveLectureMutation() {
  return Urql.useMutation<LeaveLectureMutation, LeaveLectureMutationVariables>(LeaveLectureDocument);
};
export const UpdateLectureDocument = gql`
    mutation UpdateLecture($name: String!) {
  updateLecture(input: {name: $name}) {
    ...Lecture
  }
}
    ${LectureFragmentDoc}`;

export function useUpdateLectureMutation() {
  return Urql.useMutation<UpdateLectureMutation, UpdateLectureMutationVariables>(UpdateLectureDocument);
};
export const SendMessageDocument = gql`
    mutation SendMessage($text: String!, $parentMessage: ID, $groupId: ID) {
  sendMessage(
    input: {text: $text, parentMessage: $parentMessage, group: $groupId}
  ) {
    ...Message
  }
}
    ${MessageFragmentDoc}
${UserFragmentDoc}`;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const DeleteProfileDocument = gql`
    mutation DeleteProfile {
  deleteProfile {
    success
  }
}
    `;

export function useDeleteProfileMutation() {
  return Urql.useMutation<DeleteProfileMutation, DeleteProfileMutationVariables>(DeleteProfileDocument);
};
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($name: String, $bio: String, $color: String, $avatar: Upload, $deleteAvatar: Boolean) {
  updateProfile(
    input: {name: $name, bio: $bio, color: $color, avatar: $avatar, deleteAvatar: $deleteAvatar}
  ) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useUpdateProfileMutation() {
  return Urql.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument);
};
export const AnnotationsDocument = gql`
    query Annotations {
  annotations {
    ...Annotation
  }
}
    ${AnnotationFragmentDoc}
${UserFragmentDoc}`;

export function useAnnotationsQuery(options?: Omit<Urql.UseQueryArgs<AnnotationsQueryVariables>, 'query'>) {
  return Urql.useQuery<AnnotationsQuery, AnnotationsQueryVariables>({ query: AnnotationsDocument, ...options });
};
export const CommentsDocument = gql`
    query Comments($annotationId: ID!) {
  comments(annotationId: $annotationId) {
    ...Comment
  }
}
    ${CommentFragmentDoc}
${UserFragmentDoc}`;

export function useCommentsQuery(options: Omit<Urql.UseQueryArgs<CommentsQueryVariables>, 'query'>) {
  return Urql.useQuery<CommentsQuery, CommentsQueryVariables>({ query: CommentsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const GroupDocument = gql`
    query Group {
  group {
    ...Group
  }
}
    ${GroupFragmentDoc}`;

export function useGroupQuery(options?: Omit<Urql.UseQueryArgs<GroupQueryVariables>, 'query'>) {
  return Urql.useQuery<GroupQuery, GroupQueryVariables>({ query: GroupDocument, ...options });
};
export const GroupMembersDocument = gql`
    query GroupMembers($id: ID!) {
  groupMembers(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useGroupMembersQuery(options: Omit<Urql.UseQueryArgs<GroupMembersQueryVariables>, 'query'>) {
  return Urql.useQuery<GroupMembersQuery, GroupMembersQueryVariables>({ query: GroupMembersDocument, ...options });
};
export const LectureDocument = gql`
    query Lecture {
  lecture {
    ...Lecture
  }
}
    ${LectureFragmentDoc}`;

export function useLectureQuery(options?: Omit<Urql.UseQueryArgs<LectureQueryVariables>, 'query'>) {
  return Urql.useQuery<LectureQuery, LectureQueryVariables>({ query: LectureDocument, ...options });
};
export const ParticipantsDocument = gql`
    query Participants {
  participants {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useParticipantsQuery(options?: Omit<Urql.UseQueryArgs<ParticipantsQueryVariables>, 'query'>) {
  return Urql.useQuery<ParticipantsQuery, ParticipantsQueryVariables>({ query: ParticipantsDocument, ...options });
};
export const MessagesDocument = gql`
    query Messages($groupId: ID, $before: String, $after: String, $last: Int, $first: Int) {
  messages(
    group: $groupId
    before: $before
    after: $after
    last: $last
    first: $first
  ) {
    totalCount
    pageInfo {
      startCursor
      hasNextPage
      hasPreviousPage
      endCursor
    }
    nodes {
      ...Message
    }
  }
}
    ${MessageFragmentDoc}
${UserFragmentDoc}`;

export function useMessagesQuery(options?: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<MessagesQuery, MessagesQueryVariables>({ query: MessagesDocument, ...options });
};
export const AnnotationWasCreatedDocument = gql`
    subscription AnnotationWasCreated {
  annotationWasCreated {
    ...Annotation
  }
}
    ${AnnotationFragmentDoc}
${UserFragmentDoc}`;

export function useAnnotationWasCreatedSubscription<TData = AnnotationWasCreatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<AnnotationWasCreatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<AnnotationWasCreatedSubscription, TData>) {
  return Urql.useSubscription<AnnotationWasCreatedSubscription, TData, AnnotationWasCreatedSubscriptionVariables>({ query: AnnotationWasCreatedDocument, ...options }, handler);
};
export const AnnotationWasRemovedDocument = gql`
    subscription AnnotationWasRemoved {
  annotationWasRemoved {
    id
  }
}
    `;

export function useAnnotationWasRemovedSubscription<TData = AnnotationWasRemovedSubscription>(options: Omit<Urql.UseSubscriptionArgs<AnnotationWasRemovedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<AnnotationWasRemovedSubscription, TData>) {
  return Urql.useSubscription<AnnotationWasRemovedSubscription, TData, AnnotationWasRemovedSubscriptionVariables>({ query: AnnotationWasRemovedDocument, ...options }, handler);
};
export const CommentWasAddedDocument = gql`
    subscription CommentWasAdded($annotationId: ID) {
  commentWasAdded(annotationId: $annotationId) {
    ...Comment
  }
}
    ${CommentFragmentDoc}
${UserFragmentDoc}`;

export function useCommentWasAddedSubscription<TData = CommentWasAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<CommentWasAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<CommentWasAddedSubscription, TData>) {
  return Urql.useSubscription<CommentWasAddedSubscription, TData, CommentWasAddedSubscriptionVariables>({ query: CommentWasAddedDocument, ...options }, handler);
};
export const GroupMemberJoinedDocument = gql`
    subscription GroupMemberJoined($id: ID!) {
  groupMemberJoined(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useGroupMemberJoinedSubscription<TData = GroupMemberJoinedSubscription>(options: Omit<Urql.UseSubscriptionArgs<GroupMemberJoinedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GroupMemberJoinedSubscription, TData>) {
  return Urql.useSubscription<GroupMemberJoinedSubscription, TData, GroupMemberJoinedSubscriptionVariables>({ query: GroupMemberJoinedDocument, ...options }, handler);
};
export const GroupMemberLeftDocument = gql`
    subscription GroupMemberLeft($id: ID!) {
  groupMemberLeft(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useGroupMemberLeftSubscription<TData = GroupMemberLeftSubscription>(options: Omit<Urql.UseSubscriptionArgs<GroupMemberLeftSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GroupMemberLeftSubscription, TData>) {
  return Urql.useSubscription<GroupMemberLeftSubscription, TData, GroupMemberLeftSubscriptionVariables>({ query: GroupMemberLeftDocument, ...options }, handler);
};
export const GroupWasUpdatedDocument = gql`
    subscription GroupWasUpdated($id: ID!) {
  groupWasUpdated(id: $id) {
    ...Group
  }
}
    ${GroupFragmentDoc}`;

export function useGroupWasUpdatedSubscription<TData = GroupWasUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<GroupWasUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GroupWasUpdatedSubscription, TData>) {
  return Urql.useSubscription<GroupWasUpdatedSubscription, TData, GroupWasUpdatedSubscriptionVariables>({ query: GroupWasUpdatedDocument, ...options }, handler);
};
export const LectureWasUpdatedDocument = gql`
    subscription LectureWasUpdated {
  lectureWasUpdated {
    ...Lecture
  }
}
    ${LectureFragmentDoc}`;

export function useLectureWasUpdatedSubscription<TData = LectureWasUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<LectureWasUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<LectureWasUpdatedSubscription, TData>) {
  return Urql.useSubscription<LectureWasUpdatedSubscription, TData, LectureWasUpdatedSubscriptionVariables>({ query: LectureWasUpdatedDocument, ...options }, handler);
};
export const ParticipantJoinedDocument = gql`
    subscription ParticipantJoined {
  participantJoined {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useParticipantJoinedSubscription<TData = ParticipantJoinedSubscription>(options: Omit<Urql.UseSubscriptionArgs<ParticipantJoinedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<ParticipantJoinedSubscription, TData>) {
  return Urql.useSubscription<ParticipantJoinedSubscription, TData, ParticipantJoinedSubscriptionVariables>({ query: ParticipantJoinedDocument, ...options }, handler);
};
export const ParticipantLeftDocument = gql`
    subscription ParticipantLeft {
  participantLeft {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useParticipantLeftSubscription<TData = ParticipantLeftSubscription>(options: Omit<Urql.UseSubscriptionArgs<ParticipantLeftSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<ParticipantLeftSubscription, TData>) {
  return Urql.useSubscription<ParticipantLeftSubscription, TData, ParticipantLeftSubscriptionVariables>({ query: ParticipantLeftDocument, ...options }, handler);
};
export const MessageWasSentDocument = gql`
    subscription MessageWasSent($groupId: ID) {
  messageWasSent(groupId: $groupId) {
    ...Message
  }
}
    ${MessageFragmentDoc}
${UserFragmentDoc}`;

export function useMessageWasSentSubscription<TData = MessageWasSentSubscription>(options: Omit<Urql.UseSubscriptionArgs<MessageWasSentSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<MessageWasSentSubscription, TData>) {
  return Urql.useSubscription<MessageWasSentSubscription, TData, MessageWasSentSubscriptionVariables>({ query: MessageWasSentDocument, ...options }, handler);
};
export const UserWasRemovedDocument = gql`
    subscription UserWasRemoved {
  userWasRemoved {
    id
  }
}
    `;

export function useUserWasRemovedSubscription<TData = UserWasRemovedSubscription>(options: Omit<Urql.UseSubscriptionArgs<UserWasRemovedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<UserWasRemovedSubscription, TData>) {
  return Urql.useSubscription<UserWasRemovedSubscription, TData, UserWasRemovedSubscriptionVariables>({ query: UserWasRemovedDocument, ...options }, handler);
};
export const UserWasUpdatedDocument = gql`
    subscription UserWasUpdated {
  userWasUpdated {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useUserWasUpdatedSubscription<TData = UserWasUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<UserWasUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<UserWasUpdatedSubscription, TData>) {
  return Urql.useSubscription<UserWasUpdatedSubscription, TData, UserWasUpdatedSubscriptionVariables>({ query: UserWasUpdatedDocument, ...options }, handler);
};