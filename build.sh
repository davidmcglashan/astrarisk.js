#! /bin/zsh

export BASE="/Users/david/Code/astrarisk.js"
export DOCS="/Users/david/Web/davidmcglashan.github.io/docs/astrarisk.js"

cd $DOCS

echo 'emptying folder ...'
rm -R $DOCS/*

echo 'restoring ...'
cp $BASE/*.html $DOCS
cp $BASE/*.js $DOCS
cp $BASE/*.css $DOCS

# Print the date and time so I can eyeball the console to see when this last ran
echo '--'
date