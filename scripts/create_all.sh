#!/bin/bash

# Running from the cn directory!

cd immutability
./create.sh
cd ../idempotency
./create.sh
cd ../resiliency_I
./create.sh
cd ../resiliency_II
./create.sh
cd ../architectural
./create.sh