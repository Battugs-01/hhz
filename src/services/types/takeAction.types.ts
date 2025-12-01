import { z } from 'zod';
import { BaseResponse, PaginationResponse } from './common.types';


export const takeActionSchema = z.object({
    actionId: z.string(),   
    createdAt: z.number().optional(),
    content: z.object({
        mainTitle: z.string(),
        mainDesc: z.string(),
        deepLink: z.string().optional(),
        content: z
        .array(
            z.object({
            title: z.string(),
            desc: z.string(),
            status: z.string(),
            type: z.string(),
            value: z.string().optional()
            })
        )
        .optional()
    }),
    contentType: z.enum(['EMAIL', 'PHONE', 'MARK_DOWN']),
    updatedAt: z.number().optional(),
    status: z.enum(['active', 'inactive']),
    type: z.string()
});

export const takeAcitonApiResponseSchema = z.object({
  actionId: z.string(),
  createdAt: z.number().optional(),
  content: z.object({
    mainTitle: z.string(),
    mainDesc: z.string(),
    deepLink: z.string().optional(),
    content: z
      .array(
        z.object({
          title: z.string(),
          desc: z.string(),
          status: z.string(),
          type: z.string(),
          value: z.string().optional()
        })
      )
      .optional()
  }),
  contentType: z.enum(['EMAIL', 'PHONE', 'MARK_DOWN']),
  updatedAt: z.number().optional(),
  status: z.enum(['active', 'inactive']),
  type: z.string()
});

export type TakeAction = z.infer<typeof takeAcitonApiResponseSchema>;

export const takeActionCreateBodySchema = z.object({
  actionId: z.string().optional(),
  createdAt: z.number().optional(),
  content: z.object({
    mainTitle: z.string(),
    mainDesc: z.string(),
    deepLink: z.string().optional(),
    content: z
      .array(
        z.object({
          title: z.string(),
          desc: z.string(),
          status: z.enum(['waiting', 'success']),
          type: z.string(),
          value: z.string().optional()
        })
      )
      .optional()
      .nullable()
  }),
  updatedAt: z.number().optional(),
  status: z.enum(['active', 'inactive']),
  contentType: z.enum(['EMAIL', 'PHONE', 'MARK_DOWN']),
  type: z.string()
});

export type TakeActionCreateBody = z.infer<typeof takeActionCreateBodySchema>;

export const takeActionUpdateBodySchema = z.object({
  actionId: z.string(),
  createdAt: z.number().optional(),
  content: z.object({
    mainTitle: z.string(),
    mainDesc: z.string(),
    deepLink: z.string().optional(),
    content: z
      .array(
        z.object({
          title: z.string(),
          desc: z.string(),
          status: z.string(),
          type: z.string(),
          value: z.string().optional()
        })
      )
      .optional()
  }),
  updatedAt: z.number().optional(),
  status: z.enum(['active', 'inactive']),
  contentType: z.enum(['EMAIL', 'PHONE', 'MARK_DOWN']),
  type: z.string()
});

export type TakeActionUpdateBody = z.infer<typeof takeActionUpdateBodySchema>;

export const TakeActionIdParams = z.object({
  actionId: z.string()
});

export const TakeActionListParams = z.object({
  status: z.string()
});

export interface TakeActionList  {
  actionId: string,
  createdAt: number,
  content: null,
  contentType: string,
  updatedAt: number | undefined,
  status?: 'active' | 'inactive'
  type: string
};

export interface TakeActionRequest {
    page?: number
    pageSize?: number
    lastEvaluatedKey?: string | Record<string, unknown>
    status?: 'active' | 'inactive',
}


export const takeActionListSchema = z.object({
  items: z.array(takeAcitonApiResponseSchema),
  total: z.number(),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional().nullable,
})
export type TakeActionListRes = z.infer<typeof takeActionListSchema>;


export interface TakeActionListResponse
  extends BaseResponse<{
      items: TakeAction[]
      total: number
      lastEvaluatedKey?: string | Record<string, unknown>
    }> {}


export interface TakeActionBackendListResponse{
  data: {
    list: TakeAction[]
    total?: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }
  msg: string
  code: number
}


export function transformTakeActionApiResponse(
  apiData: z.infer<typeof takeAcitonApiResponseSchema>
): z.infer<typeof takeActionSchema> {

  return {
    actionId: apiData.actionId,
    createdAt: apiData.createdAt,
    content: apiData.content,
    contentType: apiData.contentType,
    updatedAt: apiData.updatedAt,
    status: apiData.status,
    type: apiData.type
  }
}
