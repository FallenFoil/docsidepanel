import * as vscode from 'vscode';
import * as path from 'path';

export async function createFile(docPath: string){
  let newName = await vscode.window.showInputBox({prompt: 'New file name'});
  if(!newName){
    return;
  }
  let fileUri = vscode.Uri.file(path.join(docPath, newName));
  await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(''));
}

export async function createFolder(docPath: string){
  let newName = await vscode.window.showInputBox({prompt: 'New directory name'});
  if(!newName){
    return;
  }
  let dirUri = vscode.Uri.file(path.join(docPath, newName));
  vscode.workspace.fs.createDirectory(dirUri);
}