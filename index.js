#!/usr/bin/env node

'use strict';

const
  csv = require('csv'),
  parse = require('csv-parse'),
  fs = require('fs'),
  exec = require('child_process').exec,
  argv = require('minimist')(process.argv.slice(2));

console.dir(argv);

if (!argv.f) { 
  console.log('Use -f to pass the path of the .csv file of student github names representing for the class.');
  process.exit(1);  
}

parseCsv(argv.f, function(err, students) {
  if(err) throw err;
  students.forEach(function(student) {
    createStudentBranch(student);
  });
});

function createStudentBranch(student) {
    var cmd = `git checkout -b ${student} && git push origin ${student}`;
    var child = exec(cmd, function (err, stdout, stderr) {
        if (err) { throw err; }
        console.log(`Successfully created student branch for ${student}!`);
    });
}

function deleteStudentBranch(student) {
  // git branch -D name_of_your_new_branch
  // git push origin --delete name_of_your_new_branch
}

function parseCsv(path, callback) {
  var readStream = fs.createReadStream(__dirname + '/' + path);
  var parser = parse({columns: true}, function(err, data) {
    callback(err, data);
  });

  parser.on('finish', function() {
    console.log('csv parsed!');
  });
  readStream.pipe(parser);
} 
