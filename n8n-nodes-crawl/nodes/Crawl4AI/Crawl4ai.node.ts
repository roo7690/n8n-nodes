import {
  IExecuteFunctions, INodeType, INodeTypeDescription, NodeConnectionTypes, NodeOutput,
  NodeApiError, NodeOperationError
} from "n8n-workflow"

export class Crawl4ai implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Crawl4AI',
    name: 'crawl4ai',
    subtitle: undefined,
    // eslint-disable-next-line
    icon: 'file:crawl4ai.png',
    group: ['transform'],
    version: 1,
    description: 'Extract web content using Crawl4AI',
    defaults: {
      name: 'Crawl4AI'
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    properties: [
      {
        displayName: 'URLs',
        name: 'urls',
        type: 'json',
        default: '[]',
        required: true,
        description: 'Array of URLs to crawl',
        placeholder: '["https://news.ycombinator.com"]'
      }
    ]
  }

  async execute (this: IExecuteFunctions): Promise<NodeOutput>
  {
    const urls = this.getNodeParameter('urls', 0, ["https://news.ycombinator.com"], { ensureType: 'array' }) as string[]

    if (!urls.every((url) => typeof url === 'string')) {
      throw new NodeOperationError(
        this.getNode(),
        'URLs must contain only strings',
        { itemIndex: 0 }
      )
    }

    let response
    try {
      response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'http://crawl4ai:11235/crawl',
        body: { urls },
        headers: {
          'Authorization': 'Bearer no_token',
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      throw new NodeApiError(
        this.getNode(),
        error as ConstructorParameters<typeof NodeApiError>[1]
      )
    }

    return [this.helpers.returnJsonArray(response)]
  }
}