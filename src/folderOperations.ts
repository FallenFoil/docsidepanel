import * as vscode from 'vscode';
import * as path from 'path';

import { Document } from './TreeDataProvider';

export async function createFile(docPath: string, doc?: Document){
  let newName = await vscode.window.showInputBox({prompt: 'New file name'});
  if(!newName){
    return;
  }

  let fileUri = vscode.Uri.file(path.join(docPath, newName));

  if(doc){
    if(doc.isDir){
      fileUri = vscode.Uri.file(path.join(doc.uri.path, newName));
    }
    else{
      fileUri = vscode.Uri.file(path.join(path.dirname(doc.uri.path), newName));
    }
  }

  if(!fileUri) return;

  await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(''));
}

export async function createFolder(docPath: string, doc?: Document){
  let newName = await vscode.window.showInputBox({prompt: 'New directory name'});
  if(!newName){
    return;
  }

  let dirUri = vscode.Uri.file(path.join(docPath, newName));
  
  if(doc){
    if(doc.isDir){
      dirUri = vscode.Uri.file(path.join(doc.uri.path, newName));
    }
    else{
      dirUri = vscode.Uri.file(path.join(path.dirname(doc.uri.path), newName));
    }
  }

  if(!dirUri) return;

  vscode.workspace.fs.createDirectory(dirUri);
}