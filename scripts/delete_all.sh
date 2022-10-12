#!/bin/bash

# Running from the cn directory!

cd immutability
./delete.sh
cd ../idempotency
./delete.sh
cd ../resiliency_I
./delete.sh
cd ../resiliency_II
./delete.sh
cd ../architectural
./delete.sh