import React from 'react';
import useWidgets from '../../../../hooks/useWidgets';

const TwoColumnBlockGroup = ({ options, service, setService }) => {
    const switchWidget = useWidgets(service, setService);
    return (
        <div className='border-b border-borderColor pt-24px pb-24px grid grid-cols-2 gap-y-8 gap-x-2 md:gap-x-0'>
            {options.map(widget => (
                <div className='flex justify-center items-center'>{switchWidget(widget)}</div>
            ))}
        </div>
    );
};

export default TwoColumnBlockGroup;
