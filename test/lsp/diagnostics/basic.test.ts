import * as vscode from 'vscode';
import { getDocUri, activateLS, sleep, showFile, FILE_LOAD_SLEEP_TIME } from '../../helper';
import { position, sameLineRange, range } from '../util';
import { testDiagnostics } from './helper';

describe('Should find cmmon diagnostics for all regions', () => {
  const docUri = getDocUri('client/diagnostics/Basic.vue');

  before('activate', async () => {
    await activateLS();
    await showFile(docUri);
    await sleep(FILE_LOAD_SLEEP_TIME);
  });

  it('shows diagnostic errors for <script> region', async () => {
    const expectedDiagnostics: vscode.Diagnostic[] = [
      {
        range: sameLineRange(25, 4, 5),
        severity: vscode.DiagnosticSeverity.Error,
        message: "',' expected."
      },
      {
        range: sameLineRange(7, 9, 12),
        severity: vscode.DiagnosticSeverity.Error,
        message: "Argument of type '\"5\"' is not assignable to parameter of type 'number'."
      },
      {
        range: sameLineRange(8, 0, 29),
        severity: vscode.DiagnosticSeverity.Error,
        message: "'Item' is declared but its value is never read."
      },
      {
        range: sameLineRange(8, 17, 29),
        severity: vscode.DiagnosticSeverity.Error,
        message: "Cannot find module './Void.vue'."
      },
      {
        range: sameLineRange(11, 16, 19),
        severity: vscode.DiagnosticSeverity.Error,
        message: "Cannot find name 'Ite'."
      },
      {
        range: range(17, 2, 21, 3),
        severity: vscode.DiagnosticSeverity.Error,
        // tslint:disable-next-line
        message: "Argument of type '{ components: { Ite: any; }; data(this: CombinedVueInstance<Vue, {}, {}, {}, Readonly<Record<neve...' is not assignable to parameter of type 'ComponentOptions<Vue, DefaultData<Vue>, DefaultMethods<Vue>, DefaultComputed, PropsDefinition<Rec...'.\n  Object literal may only specify known properties, and 'compute' does not exist in type 'ComponentOptions<Vue, DefaultData<Vue>, DefaultMethods<Vue>, DefaultComputed, PropsDefinition<Rec...'."
      },
      {
        range: sameLineRange(24, 14, 16),
        severity: vscode.DiagnosticSeverity.Error,
        message: "Property 'lo' does not exist on type 'Console'."
      }
    ];

    await testDiagnostics(docUri, position(2, 5), expectedDiagnostics);
  });

  it('shows diagnostic errors for <style> region', async () => {
    const expectedDiagnostics: vscode.Diagnostic[] = [
      {
        severity: vscode.DiagnosticSeverity.Error,
        message: 'property value expected',
        range: sameLineRange(33, 0, 1),
        code: 'css-propertyvalueexpected',
        source: 'scss'
      }
    ];

    await testDiagnostics(docUri, position(2, 5), expectedDiagnostics);
  });
});