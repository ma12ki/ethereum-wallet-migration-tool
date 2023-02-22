import { SCRAPERAPI_KEY } from '../env';
import { IAsset } from '../types';

export async function scrapeAssets(address: string): Promise<IAsset[]> {
  const res = await fetch(
    `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=https://etherscan.io/address/${address}`
  );
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return extractAssets(doc);
}

function extractAssets(doc: Document): IAsset[] {
  return extractAssets_newUI(doc) || extractAssets_oldUI(doc);
}

function extractAssets_newUI(doc: Document): IAsset[] | null {
  const assets: IAsset[] = [];
  const availableBalance = doc.querySelector('#availableBalance');
  if (!availableBalance) return null;

  const lis = availableBalance.querySelectorAll('li');

  lis.forEach((li) => {
    if (isSpam(li)) return;
    assets.push(extractAssetData(li));
  });

  return assets.filter((a) => !!a.address).filter((a) => a.kind !== '-');

  //////////////////////

  function extractAssetData(li: Element): IAsset {
    try {
      const kind = li.classList.contains('list-custom-ERC20')
        ? 'ERC20'
        : li.querySelector('span.badge.rounded-pill:last-child')?.textContent?.replace('-', '') || ('-' as any);
      const address = li.querySelector('a')?.getAttribute('href')?.split('/')[2].split('?')[0] || '';

      if (kind === 'ERC20') {
        const amountAndNameText = li.querySelector('span.text-muted')?.textContent || '';
        const amountAndName = amountAndNameText.split(' ');
        const amount = toNumber(amountAndName[0]);
        const name = amountAndName.slice(1).join(' ');
        const valueText = li.querySelector('.list-usd-value')?.textContent!.replace('$', '') || '';
        const value = toNumber(valueText);

        return {
          address,
          name,
          amount,
          value,
          kind,
        };
      }

      const name = li.querySelector('span.text-muted')?.textContent || '';
      let amount = 1;
      const amountNode = li.querySelector('span.badge.rounded-pill:first-child')?.textContent || '';
      if (amountNode.includes('x')) {
        amount = +amountNode.split('x')[1];
      }

      return {
        address,
        name,
        amount,
        value: 0,
        kind,
      };
    } catch (e) {
      console.error(e);
      return {
        address: '',
        name: '',
        amount: 0,
        value: 0,
        kind: '-',
      };
    }
  }

  function isSpam(li: Element) {
    let spam = false;
    try {
      const usdRate = li.querySelector('.list-usd-rate')?.textContent!.toLowerCase()!;
      spam = usdRate.includes('spam');
    } catch (e) {}

    try {
      const nodeText = li.querySelector('span.text-muted')?.textContent!.toLowerCase()!;
      spam = spam || nodeText.includes('https') || nodeText.includes('visit') || nodeText.includes('claim');
    } catch (e) {}

    return spam;
  }
}

function extractAssets_oldUI(doc: Document): IAsset[] {
  return [];
}

function toNumber(str: string) {
  return +(str || '').replace('$', '').replace(/,/g, '') || 0;
}
