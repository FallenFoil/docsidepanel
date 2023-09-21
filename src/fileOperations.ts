import * as vscode from 'vscode';
import * as path from 'path';

import { Document } from './TreeDataProvider';

export function cutFile(doc?: Document){}

export function copyFile(doc?: Document){}

export async function renameFile(doc?: Document){
  if(doc){
    let newName = await vscode.window.showInputBox({prompt: 'New name', placeHolder: doc.label, value: doc.label});
    if(!newName){
      return;
    }

    let pathParts = doc.uri.path.split(doc.label);
    pathParts.pop();
    pathParts.push(newName);

    let newUri = vscode.Uri.file(path.join(...pathParts));
    vscode.workspace.fs.rename(doc.uri, newUri, {overwrite: true});
  }
}

export async function deleteFile(doc?: Document){
  if(doc){
    let response = await vscode.window.showInformationMessage(`Are you sure you want to delete \'${doc.label}\'?`, {detail: 'You can restore this file from the Trash.', modal: true}, {title: 'Move To Trash'});
    if(response){
      vscode.workspace.fs.delete(doc.uri, {recursive: true, useTrash: true});
    }
  }
}