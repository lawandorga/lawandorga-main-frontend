#!/bin/bash

printf "\nformat:\n" && npm run format
printf "\nlint:\n" && npm run lint
printf "\n\n"
printf "typescript:\n" && npm run tscheck
printf "\n\n"
printf "tests:\n" && npm run test
printf "\n\n"
