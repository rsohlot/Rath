import { observer } from 'mobx-react-lite';
import { ChoiceGroup, IChoiceGroupOption, Label, Panel, Toggle, DefaultButton, PrimaryButton } from '@fluentui/react';
import React, { useMemo, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useGlobalStore } from '../../store';
import OperationBar from './operationBar';

const PatternSetting: React.FC = () => {
    const { semiAutoStore } = useGlobalStore();

    useEffect(() => {
        semiAutoStore.getConfigurePersistence();
    }, []);

    const onRenderFooterContent = React.useCallback(
        () => (
            <div className='flex flex-end'>
                <DefaultButton
                    onClick={() => {
                        semiAutoStore.setShowSettings(false);
                    }}
                >
                    Cancel
                </DefaultButton>
                <PrimaryButton
                className='ml-2'
                    onClick={() => {
                        semiAutoStore.configurePersistence();
                        semiAutoStore.setShowSettings(false);
                    }}
                >
                    Save
                </PrimaryButton>
            </div>
        ),
        []
    );

    const options = useMemo<IChoiceGroupOption[]>(() => {
        return [
            { text: intl.get('semiAuto.main.vizsys.lite'), key: 'lite' },
            { text: intl.get('semiAuto.main.vizsys.strict'), key: 'strict' }
        ]
    }, [])
    const { showSettings, settings, autoAsso } = semiAutoStore;
    const { vizAlgo } = settings;
    return <Panel
        isOpen={showSettings}
        headerText={intl.get('common.settings')}
        onDismiss={() => {
            semiAutoStore.setShowSettings(false);
        }}
        onRenderFooterContent={onRenderFooterContent}
        >
        <hr />
        <ChoiceGroup
            label={intl.get('semiAuto.main.vizsys.title')}
            onChange={(e, op) => {
                op && semiAutoStore.updateSettings('vizAlgo', op.key)
            }}
            selectedKey={vizAlgo}
            options={options}
        />
        <hr style={{ marginTop: '1em'}} />
        <Label>Auto Prediction</Label>
        <Toggle checked={autoAsso.featViews} onText="Auto" offText="Manual" label="Feat" onChange={(e, checked) => {
            semiAutoStore.updateAutoAssoConfig('featViews', Boolean(checked))
        }} />
        <Toggle checked={autoAsso.pattViews} onText="Auto" offText="Manual" label="Patt" onChange={(e, checked) => {
            semiAutoStore.updateAutoAssoConfig('pattViews', Boolean(checked))
        }} />
        <Toggle checked={autoAsso.filterViews} onText="Auto" offText="Manual" label="Subspace" onChange={(e, checked) => {
            semiAutoStore.updateAutoAssoConfig('filterViews', Boolean(checked))
        }} />
        <hr />
        <OperationBar />
    </Panel>
}

export default observer(PatternSetting);
