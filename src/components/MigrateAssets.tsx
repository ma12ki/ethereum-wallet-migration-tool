import { Button, Checkbox, Form, Input } from 'antd';
import { useCallback, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

import { useMigrateAssets, useSelectAssets } from '../hooks';
import MigrateAssetsModal from './MigrateAssetsModal';

export default function MigrateAssets() {
  const { address, connector } = useAccount();
  const signerRes = useSigner();
  const { assets } = useSelectAssets();
  const { loading, migrate } = useMigrateAssets();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  console.log(connector, signerRes);

  const handleMigrate = useCallback(async () => {
    const { targetAddress, migrateEth } = await form.validateFields();

    setModalOpen(true);

    await migrate({
      assets,
      from: address!,
      to: targetAddress,
      migrateEth,
      signer: signerRes.data!,
    });
  }, [assets, address, signerRes]);

  return (
    <div className="MigrateAssets">
      {assets.length > 0 && (
        <Form form={form}>
          <Form.Item name="targetAddress" rules={[{ required: true }]}>
            <Input type="text" placeholder="Target address" style={{ width: '400px', textAlign: 'center' }} />
          </Form.Item>
          <Form.Item name="migrateEth" valuePropName="checked">
            <Checkbox>Migrate ETH too</Checkbox>
          </Form.Item>
          <Button size="large" type="primary" onClick={handleMigrate} loading={loading} disabled={loading}>
            Migrate
          </Button>
        </Form>
      )}
      <MigrateAssetsModal open={modalOpen} />
    </div>
  );
}
