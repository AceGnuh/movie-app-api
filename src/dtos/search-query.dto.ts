import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class SearchQuery {
  @Optional()
  @Transform(({ value }) => value.trim())
  key: string;

  @Optional()
  @Transform(({ value }) => value.trim())
  max_value: string;

  @Optional()
  @Transform(({ value }) => {
    value.trim();
    value = parseInt(value);
    return value;
  })
  min_value: number;
}
