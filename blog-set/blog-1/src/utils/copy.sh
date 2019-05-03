#!/bin/sh
cd /Users/admin/Documents/node-learn/blog-set/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo '' > access.log