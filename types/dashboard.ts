export type RefineryStatus = 'idle' | 'analyzing' | 'suggested' | 'corrected';
export type  RefineryQuality = 'green'| 'yellow' | 'red';

export interface RefineryResponse {
    status: RefineryQuality;
    improved_prompt: string;
    tags: string[];
    reason: string;
}

export interface PromptRequest{
    prompt: string;
    useMock: boolean;
}