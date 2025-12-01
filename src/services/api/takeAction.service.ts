import { TakeActionBackendListResponse, TakeActionListResponse, TakeActionRequest } from "../types/takeAction.types"
import { takeActionApiClient } from "./client"


export const TakeActionService = {
    // Take Action methods
    listTakeAction: async (
        params: TakeActionRequest = {}
      ): Promise<TakeActionListResponse> => {
        const apiBody: Record<string, unknown> = {
            'status': params.status
        }
    
        if (
          params.lastEvaluatedKey !== undefined &&
          params.lastEvaluatedKey !== null
        ) {
          // Parse string to object if needed - Axios will automatically stringify objects
          if (typeof params.lastEvaluatedKey === 'string') {
            try {
              // Try to parse the string as JSON to get object
              apiBody.lastEvaluatedKey = JSON.parse(params.lastEvaluatedKey)
            } catch {
              // If parsing fails, treat it as a plain string value wrapped in object
              apiBody.lastEvaluatedKey = {
                value: params.lastEvaluatedKey,
              }
            }
          } else {
            // Already an object, use it directly
            apiBody.lastEvaluatedKey = params.lastEvaluatedKey
          }
        }
    
        const response = await takeActionApiClient.post<TakeActionBackendListResponse>(
          '/take-action/list',
          apiBody
        )
        return {
          message: response.data.msg || 'Success',
          body: {
            items: response.data.data.list || [],
            total: response.data.data.total || response.data.data.list?.length || 0,
            lastEvaluatedKey: response.data.data.lastEvaluatedKey,
          },
        }
    },
}