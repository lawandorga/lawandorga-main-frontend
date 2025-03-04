#!/usr/bin/env bash

find ./src \( -name '*.vue' -o -name '*.ts' \) -type f | while read file; do
  line_count="$(wc -l < "$file")"
  if [ "$line_count" -gt 200 ]; then
    echo "$file - ${line_count} lines"
  fi
done