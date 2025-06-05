
import { create } from '@web3-storage/w3up-client'

export class IPFSService {
  private static client: any = null;

  static async getClient() {
    if (!this.client) {
      this.client = await create();
    }
    return this.client;
  }

  static async uploadFile(file: File): Promise<string> {
    try {
      const client = await this.getClient();
      
      // For now, we'll use a simple upload approach
      // In production, you'd want to handle authentication properly
      const cid = await client.uploadFile(file);
      
      console.log('File uploaded to IPFS with CID:', cid.toString());
      return cid.toString();
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  static getIPFSUrl(cid: string): string {
    return `https://w3s.link/ipfs/${cid}`;
  }

  static async downloadFile(cid: string): Promise<Blob> {
    try {
      const response = await fetch(this.getIPFSUrl(cid));
      if (!response.ok) {
        throw new Error('Failed to download file from IPFS');
      }
      return await response.blob();
    } catch (error) {
      console.error('IPFS download error:', error);
      throw new Error('Failed to download file from IPFS');
    }
  }
}
