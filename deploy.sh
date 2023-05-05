#!/bin/bash

git add .
git commit -m "just adding"
git push origin additions

git request-pull https://github.com/lsandini/test main