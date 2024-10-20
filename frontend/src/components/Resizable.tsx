'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { LeftView } from './LeftView';
import { useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

export function Resizable() {
  const [response, setResponse] = useState<string | null>(null);
  // console.log(response);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full p-6">
          <LeftView setResponse={setResponse} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full overflow-y-scroll items-center justify-center p-6">
          {response ? (
            <div className="h-full w-full">
              <h1 className="text-xl font-semibold border-b p-2 mb-3">
                Response
              </h1>
              <JsonView
                className="h-full w-full"
                displaySize="expanded"
                src={response}
              />
            </div>
          ) : (
            <div className="font-medium text-lg">Response Console</div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
