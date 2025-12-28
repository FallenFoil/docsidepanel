import * as vscode from 'vscode';

export function getPath(): string {
    return vscode.workspace.getConfiguration('docsidepanel').get('path', '')
}

export async function setPath(newPath: string){
    await vscode.workspace.getConfiguration('docsidepanel').update('path', newPath, true);
}