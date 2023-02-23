interface IProps {
  hash: string;
  children: React.ReactNode;
  type?: 'address' | 'tx';
}

export default function EtherscanLink({ hash, children, type = 'address' }: IProps) {
  return (
    <a href={`https://etherscan.io/${type}/${hash}`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
