import * as vscode from 'vscode';

import { DocumentationProvider, Document } from './TreeDataProvider';
import { cutFile, copyFile, renameFile, deleteFile } from './fileOperations';
import { createFile, createFolder } from './folderOperations';


async function setDocPath(documentProvider: DocumentationProvider) {
	let folderUri = await vscode.window.showOpenDialog({title: 'Select the Documentation folder', openLabel: 'Select', canSelectFiles: false, canSelectFolders: true, canSelectMany: false});
	if(!folderUri){
		return;
	}

	await vscode.workspace.getConfiguration('doc').update('path', folderUri[0].path, true);
	documentProvider.refresh();
}

export function activate(context: vscode.ExtensionContext) {
	let docPath = vscode.workspace.getConfiguration('doc').get('path', '');
	const documentProvider: DocumentationProvider = new DocumentationProvider();
	vscode.window.registerTreeDataProvider('documents', documentProvider);

	const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(docPath), "*"));
	watcher.onDidChange(_ => documentProvider.refresh());
	watcher.onDidCreate(_ => documentProvider.refresh());
	watcher.onDidDelete(_ => documentProvider.refresh());

	let setDocumentationPath = vscode.commands.registerCommand('docsidepanel.documentationPath', () => setDocPath(documentProvider));
	let newFile = vscode.commands.registerCommand('docsidepanel.newFile', () => createFile(docPath));
	let newFolder = vscode.commands.registerCommand('docsidepanel.newFolder', () => createFolder(docPath));
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
