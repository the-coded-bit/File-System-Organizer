#!/usr/bin/env node

// all imports
const { Console } = require('console');
let fs = require('fs');
const { type } = require('os');
const path = require('path');
let process = require('process');
const supported_formats = require('./supported_formats');
const readline = require('readline');
const { resolveObjectURL } = require('buffer');


// take input of file path and command
let inputArr = process.argv.slice(2);
// console.log(inputArr);       
switch (inputArr[0]) {
    case 'help':
            helpFn();
            break;
    case 'organize':
            organizeFn(inputArr[1]);
            break;
    case 'tree':
            treeFn(inputArr[1]);
            break;    
    default:
        console.log('Type "docme help" to know more 🙏');
        break;
}

// implement help command
function helpFn(){
        console.log(
                `List of all the commands:
         docme organize "directory_path"
         docme Tree "directory_path"
         docme help
                `);
}


// implement organize command
function organizeFn(dirPath){
        let destination_folder = '';
        if(dirPath === undefined){
                destination_folder = process.cwd();
        }
               
        else{
            let dir_exists = fs.existsSync(dirPath);
            if(dir_exists && fs.statSync(dirPath).isDirectory()){
                    //create organize_files folder if path is valid
                    destination_folder = path.join(dirPath, "organized_files");
                    if(fs.existsSync(destination_folder) === false){
                        fs.mkdirSync(destination_folder);       
                    }    
            } else{
                console.log(`kindly, verify the path,
refer "docme help"`);
                return;
            }
        }
        organizeFiles(dirPath, destination_folder);
}

//organize file helper function
function organizeFiles(dirPath, destination_folder) {
       // identify categories of files in input directory
       let childNames = fs.readdirSync(dirPath);
       let fileNames = [];
       for(let i = 0; i < childNames.length; i++){
               let childfilePath = path.join(dirPath, childNames[i]);
                if(fs.lstatSync(childfilePath).isFile() === true){
                        let category = getCategory(childNames[i]);
                        // console.log(childNames[i], "belongs to -->", category);
                        sendFile(childfilePath, destination_folder, category);
                        fileNames.push(childfilePath);
                }
       }
       removeFileFromOriginal(fileNames);
}

function sendFile(src, dest, category){
        let categoryPath = path.join(dest, category);
        if(fs.existsSync(categoryPath) == false)
                fs.mkdirSync(categoryPath)
        let fileName = path.basename(src);
        let destFilePath = path.join(categoryPath, fileName);
        fs.copyFileSync(src, destFilePath);
}

function getCategory(name) {
        let extension = path.extname(name);
        extension = extension.slice(1);
        for(let type in supported_formats){
                let cTypeArray = supported_formats[type];
                for(let i = 0; i < cTypeArray.length; i++){
                        if(extension == cTypeArray[i])
                                return type;
                }
        }
        return 'others';
}

function removeFileFromOriginal(src){
        const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
        rl.question('Do you want to remove Files From original Directory? y/n \n', (answer) => {
                if(answer == 'y'){
                        for(let i = 0; i < src.length; i++){
                                fs.unlinkSync(src[i]);
                        }
                }
                        
                rl.close();                        
        });
}



// implement Tree command
function treeFn(dirPath){
        if(dirPath == undefined){
                treeHelper(process.cwd(), "");
        }
        else{
                let dir_exists = fs.existsSync(dirPath);
                if(dir_exists){
                        treeHelper(dirPath, "");
                } else{
                        console.log(`kindly, verify the path,
refer "docme help"`);
                        return;
                }
        }
}


function treeHelper(dirPath, indent){
        let isFile = fs.statSync(dirPath).isFile();
        if(isFile)
                console.log(indent + "├──" + path.basename(dirPath));
        else{
                let dirName = path.basename(dirPath)
                console.log(indent + "└──" + dirName);
                let childrens = fs.readdirSync(dirPath);
                for (let i = 0; i < childrens.length; i++) {
                    let childPath = path.join(dirPath, childrens[i]);
                    treeHelper(childPath, indent + "\t");
                }
        }       
}