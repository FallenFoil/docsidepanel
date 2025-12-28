import * as vscode from 'vscode';

import { DocumentationProvider, Document } from './TreeDataProvider';
import { cutFile, copyFile, renameFile, deleteFile } from './fileOperations';
import { createFile, createFolder } from './folderOperations';
import { getPath, setPath } from './config'


async function setDocPath(documentProvider: DocumentationProvider) {
	let folderUri = await vscode.window.showOpenDialog({title: 'Select the Documentation folder', openLabel: 'Select', canSelectFiles: false, canSelectFolders: true, canSelectMany: false});
	if(!folderUri){
		return;
	}

	await setPath(folderUri[0].fsPath)
	documentProvider.refresh();
}

export function activate(context: vscode.ExtensionContext) {
	const documentProvider: DocumentationProvider = new DocumentationProvider();
	vscode.window.registerTreeDataProvider('documents', documentProvider);

	const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(getPath()), "*"));
	watcher.onDidChange(_ => documentProvider.refresh());
	watcher.onDidCreate(_ => documentProvider.refresh());
	watcher.onDidDelete(_ => documentProvider.refresh());

	let setDocumentationPath = vscode.commands.registerCommand('docsidepanel.documentationPath', () => setDocPath(documentProvider));
	let newFile = vscode.commands.registerCommand('docsidepanel.newFile', (doc?: Document) => createFile(getPath(), doc));
	let newFolder = vscode.commands.registerCommand('docsidepanel.newFolder', (doc?: Document) => createFolder(getPath(), doc));
	let refresh = vscode.commands.registerCommand('docsidepanel.refresh', () => documentProvider.refresh());
	let fileCut = vscode.commands.registerCommand('docsidepanel.file.cut', (doc?: Document) => cutFile(doc));
	let fileCopy = vscode.commands.registerCommand('docsidepanel.file.copy', (doc?: Document) => copyFile(doc));
	let fileRename = vscode.commands.registerCommand('docsidepanel.file.rename', (doc?: Document) => renameFile(doc));
	let fileDelete = vscode.commands.registerCommand('docsidepanel.file.delete', (doc?: Document) => deleteFile(doc));

	context.subscriptions.push(setDocumentationPath);
	context.subscriptions.push(newFile);
	context.subscriptions.push(newFolder);
	context.subscriptions.push(refresh);
	context.subscriptions.push(fileCut);
	context.subscriptions.push(fileCopy);
	context.subscriptions.push(fileRename);
	context.subscriptions.push(fileDelete);
}

export function deactivate() {}
