import { IsNumber } from 'class-validator'

export class MousePositionDto {
  @IsNumber()
  x: number

  @IsNumber()
  y: number

  @IsNumber()
  pageWidth: number

  @IsNumber()
  pageHeight: number
}
