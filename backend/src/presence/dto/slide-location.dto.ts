import { IsNumber, IsOptional } from 'class-validator'

export class SlideLocationDto {
  @IsNumber()
  horizontalIndex: number

  @IsNumber()
  verticalIndex: number

  @IsNumber()
  @IsOptional()
  fragmentIndex?: number
}
