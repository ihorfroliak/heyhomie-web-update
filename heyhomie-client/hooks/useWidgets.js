import { useDispatch } from 'react-redux';
import { setServiceConfigItem } from '../lib/slices/orderSlice';

// Custom widgets
import CleaningPriceCalculationInput from '../components/citypage/servicesContainer/widgets/CleaningPriceCalculationInput';
import DropdownSelect from '../components/citypage/servicesContainer/widgets/DropdownSelect';
import DropdownSelectCarpetItems from '../components/citypage/servicesContainer/widgets/DropdownSelectCarpetItems';
import Option from '../components/citypage/servicesContainer/widgets/Option';
import RadioSelect from '../components/citypage/servicesContainer/widgets/RadioSelect';
import Select from '../components/citypage/servicesContainer/widgets/Select';
import OptionBlockSelect from '../components/citypage/servicesContainer/widgets/OptionBlockSelect';
import CounterCalculator from '../components/citypage/servicesContainer/widgets/CounterCalculator';
import CarpetTotalSizeCalculationInput from '../components/citypage/servicesContainer/widgets/CarpetTotalSizeCalculationInput';
import OptionLineSelect from '../components/citypage/servicesContainer/widgets/OptionLineSelect';

function useWidgets(service, setService) {
    const dispatch = useDispatch();

    const setServiceConfigItemEditor = ({ field, value }) => {
        const workingObject = { ...service };

        workingObject.config[field] = value;

        setService({ ...workingObject });
    };

    const chooseWidgetFunction = (value, widget) => {
        setService
            ? setServiceConfigItemEditor({
                  field: widget.name,
                  value: value,
              })
            : dispatch(
                  setServiceConfigItem({
                      homie_service_id: service.homie_service_id,
                      field: widget.name,
                      value: value,
                  })
              );
    };

    return widget => {
        switch (widget.type) {
            case 'select': {
                return (
                    <Select
                        value={service.config[widget.name]}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        descriptionCaptionKey={widget.descriptionCaptionKey}
                        options={widget.options}
                        separated={widget.separated}
                        hidden={widget.hidden}
                        widget={widget}
                        type={service.type}
                    />
                );
            }
            case 'option': {
                return (
                    <Option
                        value={service.config[widget.name]}
                        widget={widget}
                        service={service}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        optionPriceCaption={widget.optionPriceCaption}
                        subtitleCaptionKey={widget.subtitleCaptionKey}
                        separated={widget.separated}
                    />
                );
            }
            case 'radioSelect': {
                return (
                    <RadioSelect
                        value={service.config[widget.name]}
                        service={service}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        descriptionCaptionKey={widget.descriptionCaptionKey}
                        options={widget.options}
                        config={service.config}
                        separated={widget.separated}
                    />
                );
            }
            case 'dropdownSelect': {
                return (
                    <DropdownSelect
                        value={service.config[widget.name]}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        descriptionCaptionKey={widget.descriptionCaptionKey}
                        options={widget.options}
                        separated={widget.separated}
                    />
                );
            }
            case 'optionBlockSelect': {
                return (
                    <OptionBlockSelect
                        config={service.config}
                        value={service.config[widget.name]}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        hintCaptionKey={widget.hintCaptionKey}
                        options={widget.options}
                        separated={widget.separated}
                        cost={widget.cost}
                        icon={widget.icon}
                        buttonColor={widget.buttonColor}
                    />
                );
            }
            case 'optionLineSelect': {
                return (
                    <OptionLineSelect
                        config={service.config}
                        value={service.config[widget.name]}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        hintCaptionKey={widget.hintCaptionKey}
                        options={widget.options}
                        separated={widget.separated}
                        cost={widget.cost}
                        icon={widget.icon}
                    />
                );
            }
            case 'counterCalculator': {
                return (
                    <CounterCalculator
                        config={service.config}
                        value={service.config[widget.name]}
                        onSelect={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        options={widget.options}
                    />
                );
            }
            case 'cleaningPriceCalculationInput': {
                return (
                    <CleaningPriceCalculationInput
                        service={service}
                        config={service.config}
                        value={service.config[widget.name]}
                        onChange={value => {
                            chooseWidgetFunction(value, widget);
                        }}
                        nameCaptionKey={widget.nameCaptionKey}
                        descriptionCaptionKey={widget.descriptionCaptionKey}
                        separated={widget.separated}
                        minValue={widget.minValue}
                        maxValue={widget.maxValue}
                        additionalOptionsInfo={widget.additionalOptionsInfo}
                        widget_name={widget.name}
                    />
                );
            }
            case 'dropdownSelectCarpetItems': {
                return (
                    <DropdownSelectCarpetItems
                        service={service}
                        config={service.config}
                        nameCaptionKey={widget.nameCaptionKey}
                        descriptionCaptionKey={widget.descriptionCaptionKey}
                        carpet_items={service.config.carpet_items}
                        carpet_detailed_sizes={service.config.carpet_detailed_sizes}
                        options={widget.options}
                        handleChangeCarpetItems={value => {
                            dispatch(
                                setServiceConfigItem({
                                    homie_service_id: service.homie_service_id,
                                    field: 'carpet_items',
                                    value: value,
                                })
                            );
                        }}
                        handleChangeCarpetItemDetailedSizes={updatedArray => {
                            dispatch(
                                setServiceConfigItem({
                                    homie_service_id: service.homie_service_id,
                                    field: 'carpet_detailed_sizes',
                                    value: updatedArray,
                                })
                            );
                        }}
                    />
                );
            }
            case 'carpetTotalSizeCalculationInput': {
                return (
                    <CarpetTotalSizeCalculationInput
                        carpet_items={service.config.carpet_items}
                        carpet_detailed_sizes={service.config.carpet_detailed_sizes}
                        handleChangeTotalSize={value => {
                            if (value !== service.config.carpets_total_size) {
                                dispatch(
                                    setServiceConfigItem({
                                        homie_service_id: service.homie_service_id,
                                        field: 'carpets_total_size',
                                        value: value,
                                    })
                                );
                            }
                        }}
                        value={service.config.carpets_total_size}
                        nameCaptionKey={widget.nameCaptionKey}
                    />
                );
            }
            default: {
                return <div>Staging...</div>;
            }
        }
    };
}

export default useWidgets;
