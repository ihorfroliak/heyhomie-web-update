const servicesConfigs = [
    {
        name: 'cleaning',
        widgets: {
            rooms: [
                {
                    name: 'rooms_quantity',
                    type: 'counterCalculator',
                    options: [
                        {
                            value: 1,
                            captionKey: 'rooms_quantity_singular_nameCaptionKey',
                        },
                        {
                            value: 2,
                            captionKey: 'rooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 3,
                            captionKey: 'rooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 4,
                            captionKey: 'rooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 5,
                            captionKey: 'rooms_quantity_plural_different_nameCaptionKey',
                        },
                    ],
                },
                {
                    name: 'bathrooms_quantity',
                    type: 'counterCalculator',
                    options: [
                        {
                            value: 1,
                            captionKey: 'bathrooms_quantity_singular_nameCaptionKey',
                        },
                        {
                            value: 2,
                            captionKey: 'bathrooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 3,
                            captionKey: 'bathrooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 4,
                            captionKey: 'bathrooms_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 5,
                            captionKey: 'bathrooms_quantity_plural_different_nameCaptionKey',
                        },
                    ],
                },
                {
                    name: 'kitchens_quantity',
                    type: 'counterCalculator',
                    options: [
                        {
                            value: 1,
                            captionKey: 'kitchens_quantity_singular_nameCaptionKey',
                        },
                        {
                            value: 2,
                            captionKey: 'kitchens_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 3,
                            captionKey: 'kitchens_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 4,
                            captionKey: 'kitchens_quantity_plural_nameCaptionKey',
                        },
                        {
                            value: 5,
                            captionKey: 'kitchens_quantity_plural_different_nameCaptionKey',
                        },
                    ],
                },
            ],
            main: [
                {
                    name: 'frequency',
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                        {
                            value: 'every_month',
                            captionKey: 'frequency_every_month',
                        },
                        {
                            value: 'every_two_weeks',
                            captionKey: 'frequency_every_two_weeks',
                        },
                        {
                            value: 'every_week',
                            captionKey: 'frequency_every_week',
                        },
                    ],
                },
                {
                    name: 'plan',
                    type: 'select',
                    nameCaptionKey: 'cleaning_plan_nameCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'regular',
                            captionKey: 'cleaning_plan_regular',
                        },
                        {
                            value: 'deep',
                            captionKey: 'cleaning_plan_deep',
                        },
                    ],
                    linkToLanding: true,
                    linkToLanding__Caption: 'cleaning_plan_linkToLandingCopy',
                    linkToLanding__slug: 'cleaning',
                },
                {
                    name: 'cleaning_house_size',
                    type: 'cleaningPriceCalculationInput',
                    nameCaptionKey: 'cleaning_house_size_nameCaptionKey',
                    descriptionCaptionKey: 'cleaning_house_size_descriptionCaptionKey',
                    separated: true,
                    minValue: 25,
                    maxValue: 259,
                },
            ],
            additional: [
                {
                    name: 'cleaning_windows_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_windows_quantity_nameCaptionKey',
                    hintCaptionKey: 'cleaning_windows_quantity_hint_hintCaptionKey',
                    separated: false,
                    icon: 'window',
                    cost: 35,
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                        {
                            value: 6,
                        },
                        {
                            value: 7,
                        },
                        {
                            value: 8,
                        },
                        {
                            value: 9,
                        },
                        {
                            value: 10,
                        },
                        {
                            value: 11,
                        },
                        {
                            value: 12,
                        },
                        {
                            value: 13,
                        },
                        {
                            value: 14,
                        },
                        {
                            value: 15,
                        },
                        {
                            value: 16,
                        },
                        {
                            value: 17,
                        },
                        {
                            value: 18,
                        },
                        {
                            value: 19,
                        },
                        {
                            value: 20,
                        },
                    ],
                },
                {
                    name: 'cleaning_ironing_items',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_ironing_items_nameCaptionKey',
                    cost: 49,
                    separated: false,
                    icon: 'ironing',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_balcony_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_balcony_quantity_nameCaptionKey',
                    cost: 30,
                    separated: false,
                    icon: 'balcony',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_fridge_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_fridge_quantity_nameCaptionKey',
                    cost: 49,
                    separated: false,
                    icon: 'fridge',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_microwave_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_microwave_quantity_nameCaptionKey',
                    cost: 15,
                    separated: false,
                    icon: 'microwave',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_oven_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_oven_quantity_nameCaptionKey',
                    cost: 49,
                    separated: false,
                    icon: 'oven',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_kitchen_hood_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_kitchen_hood_quantity_nameCaptionKey',
                    cost: 49,
                    separated: false,
                    icon: 'kitchen_hood',
                    buttonColor: 'bg-secondary-cleaningGold',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_ventilator_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_ventilator_quantity_nameCaptionKey',
                    cost: 15,
                    separated: false,
                    icon: 'ventilators',
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'cleaning_dishes_quantity',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_dishes_quantitynameCaptionKey',
                    cost: 25,
                    separated: false,
                    icon: 'dishes',
                    options: [{ value: 1 }],
                },
                {
                    name: 'cleaning_pets_existing',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_pets_nameCaptionKey',
                    cost: 'cleaning_pets_existing_btn_text',
                    separated: false,
                    icon: 'pets',
                    options: [
                        { showValue: 'cleaning_pets_if_false', value: 0 },
                        { showValue: 'cleaning_pets_if_true', value: 1 },
                    ],
                },
                {
                    name: 'cleaning_additional_hours',
                    type: 'optionLineSelect',
                    nameCaptionKey: 'cleaning_additional_hours_nameCaptionKey',
                    descriptionCaptionKey: 'cleaning_additional_hours_descriptionCaptionKey',
                    cost: 59,
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
            ],
            priceFieldMessage: 'cleaning_priceFieldMessage',
        },
    },
    {
        name: 'flowers',
        widgets: {
            main: [
                {
                    name: 'frequency',
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                        {
                            value: 'every_week',
                            captionKey: 'frequency_every_week',
                        },
                        {
                            value: 'every_two_weeks',
                            captionKey: 'frequency_every_two_weeks',
                        },
                        {
                            value: 'every_month',
                            captionKey: 'frequency_every_month',
                        },
                    ],
                },
                {
                    name: 'plan',
                    type: 'radioSelect',
                    nameCaptionKey: 'flowers_plan_nameCaptionKey',
                    descriptionCaptionKey: 'flowers_plan_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'medium',
                            titleCaptionKey: 'flowers_plan_medium_title',
                            subtitleCaptionKey: 'flowers_plan_medium_subtitle',
                            onetimeCaptionKey: 'flowers_plan_medium_onetime',
                            recurrentCaptionKey: 'flowers_plan_medium_recurrent',
                        },
                        {
                            value: 'large',
                            titleCaptionKey: 'flowers_plan_large_title',
                            subtitleCaptionKey: 'flowers_plan_large_subtitle',
                            onetimeCaptionKey: 'flowers_plan_large_onetime',
                            recurrentCaptionKey: 'flowers_plan_large_recurrent',
                        },
                    ],
                },
                {
                    name: 'quantity',
                    type: 'dropdownSelect',
                    nameCaptionKey: 'flowers_quantity_nameCaptionKey',
                    descriptionCaptionKey: 'flowers_quantity_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 1,
                            captionKey: 'flowers_quantity_1',
                        },
                        {
                            value: 2,
                            captionKey: 'flowers_quantity_2',
                        },
                        {
                            value: 3,
                            captionKey: 'flowers_quantity_3',
                        },
                        {
                            value: 4,
                            captionKey: 'flowers_quantity_4',
                        },
                        {
                            value: 5,
                            captionKey: 'flowers_quantity_5',
                        },
                        {
                            value: 6,
                            captionKey: 'flowers_quantity_6',
                        },
                        {
                            value: 7,
                            captionKey: 'flowers_quantity_7',
                        },
                        {
                            value: 8,
                            captionKey: 'flowers_quantity_8',
                        },
                        {
                            value: 9,
                            captionKey: 'flowers_quantity_9',
                        },
                        {
                            value: 10,
                            captionKey: 'flowers_quantity_10',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: 'nails',
        widgets: {
            main: [
                {
                    name: 'frequency',
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                        {
                            value: 'every_week',
                            captionKey: 'frequency_every_week',
                        },
                        {
                            value: 'every_two_weeks',
                            captionKey: 'frequency_every_two_weeks',
                        },
                        {
                            value: 'every_month',
                            captionKey: 'frequency_every_month',
                        },
                    ],
                },
                {
                    name: 'plan',
                    type: 'radioSelect',
                    nameCaptionKey: 'nails_plan_nameCaptionKey',
                    descriptionCaptionKey: 'nails_plan_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'manicure',
                            titleCaptionKey: 'nails_plan_manicure_title',
                            subtitleCaptionKey: 'nails_manicure_subtitle',
                            onetimeCaptionKey: 'nails_manicure_onetime',
                            recurrentCaptionKey: 'nails_manicure_recurrent',
                        },
                        {
                            value: 'pedicure',
                            titleCaptionKey: 'nails_plan_pedicure_title',
                            subtitleCaptionKey: 'nails_plan_pedicure_subtitle',
                            onetimeCaptionKey: 'nails_plan_pedicure_onetime',
                            recurrentCaptionKey: 'nails_plan_pedicure_recurrent',
                        },
                        {
                            value: 'all',
                            titleCaptionKey: 'nails_plan_all_title',
                            subtitleCaptionKey: 'nails_plan_all_subtitle',
                            onetimeCaptionKey: 'nails_plan_all_onetime',
                            recurrentCaptionKey: 'nails_plan_all_recurrent',
                        },
                    ],
                },
            ],
            additional: [
                {
                    name: 'nails_polishing',
                    type: 'option',
                    nameCaptionKey: 'nails_polishing_nameCaptionKey',
                    optionPriceCaption: 'nails_polishing_priceCaption',
                    separated: false,
                    // Needed for complex conditions
                    excludes: ['nails_hybrid'],
                },
                {
                    name: 'nails_hybrid',
                    type: 'option',
                    nameCaptionKey: 'nails_hybrid_nameCaptionKey',
                    optionPriceCaption: 'nails_hybrid_priceCaption',
                    separated: false,
                    excludes: ['nails_polishing'],
                },
                {
                    name: 'nails_gel',
                    type: 'option',
                    nameCaptionKey: 'nails_gel_nameCaptionKey',
                    optionPriceCaption: 'nails_gel_priceCaption',
                    separated: false,
                    // Needed for complex conditions
                    requires: ['nails_polishing', 'nails_hybrid'],
                },
                {
                    name: 'nails_gel_removal',
                    type: 'option',
                    nameCaptionKey: 'nails_gel_removal_nameCaptionKey',
                    optionPriceCaption: 'nails_gel_removal_priceCaption',
                    separated: true,
                },
            ],
        },
    },
    {
        name: 'massage',
        widgets: {
            main: [
                {
                    name: 'frequency',
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                        {
                            value: 'every_week',
                            captionKey: 'frequency_every_week',
                        },
                        {
                            value: 'every_two_weeks',
                            captionKey: 'frequency_every_two_weeks',
                        },
                        {
                            value: 'every_month',
                            captionKey: 'frequency_every_month',
                        },
                    ],
                },
                {
                    name: 'plan',
                    type: 'select',
                    nameCaptionKey: 'massage_plan_nameCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'relaxation',
                            captionKey: 'massage_plan_relaxation',
                        },
                        {
                            value: 'deep_tissue',
                            captionKey: 'massage_plan_deep_tissue',
                        },
                        {
                            value: 'sport',
                            captionKey: 'massage_plan_sport',
                        },
                        {
                            value: 'physio',
                            captionKey: 'massage_plan_physio',
                        },
                    ],
                    linkToLanding: true,
                    linkToLanding__Caption: 'massage_plan_linkToLandingCopy',
                    linkToLanding__slug: 'massage',
                },
                {
                    name: 'quantity',
                    type: 'select',
                    nameCaptionKey: 'massage_quantity_nameCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 1,
                            captionKey: 'massage_quantity_1',
                        },
                        {
                            value: 2,
                            captionKey: 'massage_quantity_2',
                        },
                        {
                            value: 3,
                            captionKey: 'massage_quantity_3',
                        },
                    ],
                },
                {
                    name: 'massage_duration',
                    type: 'radioSelect',
                    nameCaptionKey: 'massage_duration_nameCaptionKey',
                    descriptionCaptionKey: 'massage_duration_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 45,
                            titleCaptionKey: 'massage_duration_45_title',
                            subtitleCaptionKey: 'massage_duration_45_subtitle',
                            onetimeCaptionKey: 'massage_duration_45_onetime',
                            recurrentCaptionKey: 'massage_duration_45_recurrent',
                        },
                        {
                            value: 90,
                            titleCaptionKey: 'massage_duration_90_title',
                            subtitleCaptionKey: 'massage_duration_90_subtitle',
                            onetimeCaptionKey: 'massage_duration_90_onetime',
                            recurrentCaptionKey: 'massage_duration_90_recurrent',
                        },
                        {
                            value: 120,
                            titleCaptionKey: 'massage_duration_120_title',
                            subtitleCaptionKey: 'massage_duration_120_subtitle',
                            onetimeCaptionKey: 'massage_duration_120_onetime',
                            recurrentCaptionKey: 'massage_duration_120_recurrent',
                        },
                    ],
                },
                {
                    name: 'massage_preferred_therapist_gender',
                    type: 'select',
                    nameCaptionKey: 'massage_preferred_therapist_gender_nameCaptionKey',
                    separated: false,
                    options: [
                        {
                            value: 'n',
                            captionKey: 'massage_preferred_therapist_gender_n',
                        },
                        {
                            value: 'f',
                            captionKey: 'massage_preferred_therapist_gender_f',
                        },
                        {
                            value: 'm',
                            captionKey: 'massage_preferred_therapist_gender_m',
                        },
                    ],
                },
                {
                    name: 'massage_fallback_to_any_gender',
                    type: 'option',
                    nameCaptionKey: 'massage_fallback_to_any_gender_nameCaptionKey',
                    separated: true,
                },
            ],
        },
    },
    {
        name: 'laundry',
        minOrderValue: 100,
        widgets: {
            main: [
                {
                    name: 'frequency',
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                        {
                            value: 'every_week',
                            captionKey: 'frequency_every_week',
                        },
                        {
                            value: 'every_two_weeks',
                            captionKey: 'frequency_every_two_weeks',
                        },
                        {
                            value: 'every_month',
                            captionKey: 'frequency_every_month',
                        },
                    ],
                },
            ],
            groups: [
                {
                    groupTitle: 'laundry_clothesTitle',
                    widgets: [
                        {
                            name: 'laundry_clothes_light',
                            type: 'optionWithDropdownSelect',
                            nameCaptionKey: 'laundry_clothes_light_nameCaptionKey',
                            descriptionCaptionKey: 'laundry_clothes_light_description_descriptionCaptionKey',
                            hintCaptionKey: 'laundry_clothes_light_hintCaptionKey',
                            separated: false,
                            options: [
                                {
                                    value: 1,
                                    titleCaptionKey: 'laundry_clothes_light_1',
                                },
                                {
                                    value: 2,
                                    titleCaptionKey: 'laundry_clothes_light_2',
                                },
                                {
                                    value: 3,
                                    titleCaptionKey: 'laundry_clothes_light_3',
                                },
                                {
                                    value: 4,
                                    titleCaptionKey: 'laundry_clothes_light_4',
                                },
                                {
                                    value: 5,
                                    titleCaptionKey: 'laundry_clothes_light_5',
                                },
                                {
                                    value: 6,
                                    titleCaptionKey: 'laundry_clothes_light_6',
                                },
                                {
                                    value: 7,
                                    titleCaptionKey: 'laundry_clothes_light_7',
                                },
                                {
                                    value: 8,
                                    titleCaptionKey: 'laundry_clothes_light_8',
                                },
                                {
                                    value: 9,
                                    titleCaptionKey: 'laundry_clothes_light_9',
                                },
                                {
                                    value: 10,
                                    titleCaptionKey: 'laundry_clothes_light_10',
                                },
                            ],
                        },
                        {
                            name: 'laundry_clothes_medium',
                            type: 'optionWithDropdownSelect',
                            nameCaptionKey: 'laundry_clothes_medium_nameCaptionKey',
                            descriptionCaptionKey: 'laundry_clothes_medium_description_descriptionCaptionKey',
                            hintCaptionKey: 'laundry_clothes_medium_hintCaptionKey',
                            separated: false,
                            options: [
                                {
                                    value: 1,
                                    titleCaptionKey: 'laundry_clothes_medium_1',
                                },
                                {
                                    value: 2,
                                    titleCaptionKey: 'laundry_clothes_medium_2',
                                },
                                {
                                    value: 3,
                                    titleCaptionKey: 'laundry_clothes_medium_3',
                                },
                                {
                                    value: 4,
                                    titleCaptionKey: 'laundry_clothes_medium_4',
                                },
                                {
                                    value: 5,
                                    titleCaptionKey: 'laundry_clothes_medium_5',
                                },
                                {
                                    value: 6,
                                    titleCaptionKey: 'laundry_clothes_medium_6',
                                },
                                {
                                    value: 7,
                                    titleCaptionKey: 'laundry_clothes_medium_7',
                                },
                                {
                                    value: 8,
                                    titleCaptionKey: 'laundry_clothes_medium_8',
                                },
                                {
                                    value: 9,
                                    titleCaptionKey: 'laundry_clothes_medium_9',
                                },
                                {
                                    value: 10,
                                    titleCaptionKey: 'laundry_clothes_medium_10',
                                },
                            ],
                        },
                        {
                            name: 'laundry_clothes_heavy',
                            type: 'optionWithDropdownSelect',
                            nameCaptionKey: 'laundry_clothes_heavy_nameCaptionKey',
                            descriptionCaptionKey: 'laundry_clothes_heavy_description_descriptionCaptionKey',
                            hintCaptionKey: 'laundry_clothes_heavy_hintCaptionKey',
                            separated: true,
                            options: [
                                {
                                    value: 1,
                                    titleCaptionKey: 'laundry_clothes_heavy_1',
                                },
                                {
                                    value: 2,
                                    titleCaptionKey: 'laundry_clothes_heavy_2',
                                },
                                {
                                    value: 3,
                                    titleCaptionKey: 'laundry_clothes_heavy_3',
                                },
                                {
                                    value: 4,
                                    titleCaptionKey: 'laundry_clothes_heavy_4',
                                },
                                {
                                    value: 5,
                                    titleCaptionKey: 'laundry_clothes_heavy_5',
                                },
                                {
                                    value: 6,
                                    titleCaptionKey: 'laundry_clothes_heavy_6',
                                },
                                {
                                    value: 7,
                                    titleCaptionKey: 'laundry_clothes_heavy_7',
                                },
                                {
                                    value: 8,
                                    titleCaptionKey: 'laundry_clothes_heavy_8',
                                },
                                {
                                    value: 9,
                                    titleCaptionKey: 'laundry_clothes_heavy_9',
                                },
                                {
                                    value: 10,
                                    titleCaptionKey: 'laundry_clothes_heavy_10',
                                },
                            ],
                        },
                    ],
                },
                {
                    groupTitle: 'laundry_homeTitle',
                    widgets: [
                        {
                            name: 'laundry_home_light',
                            type: 'optionWithDropdownSelect',
                            nameCaptionKey: 'laundry_home_light_nameCaptionKey',
                            descriptionCaptionKey: 'laundry_home_light_description_descriptionCaptionKey',
                            hintCaptionKey: 'laundry_home_light_hintCaptionKey',
                            separated: false,
                            options: [
                                {
                                    value: 1,
                                    titleCaptionKey: 'laundry_home_light_1',
                                },
                                {
                                    value: 2,
                                    titleCaptionKey: 'laundry_home_light_2',
                                },
                                {
                                    value: 3,
                                    titleCaptionKey: 'laundry_home_light_3',
                                },
                                {
                                    value: 4,
                                    titleCaptionKey: 'laundry_home_light_4',
                                },
                                {
                                    value: 5,
                                    titleCaptionKey: 'laundry_home_light_5',
                                },
                                {
                                    value: 6,
                                    titleCaptionKey: 'laundry_home_light_6',
                                },
                                {
                                    value: 7,
                                    titleCaptionKey: 'laundry_home_light_7',
                                },
                                {
                                    value: 8,
                                    titleCaptionKey: 'laundry_home_light_8',
                                },
                                {
                                    value: 9,
                                    titleCaptionKey: 'laundry_home_light_9',
                                },
                                {
                                    value: 10,
                                    titleCaptionKey: 'laundry_home_light_10',
                                },
                            ],
                        },
                        {
                            name: 'laundry_home_heavy',
                            type: 'optionWithDropdownSelect',
                            nameCaptionKey: 'laundry_home_heavy_nameCaptionKey',
                            descriptionCaptionKey: 'laundry_home_heavy_description_descriptionCaptionKey',
                            hintCaptionKey: 'laundry_home_heavy_hintCaptionKey',
                            separated: true,
                            options: [
                                {
                                    value: 1,
                                    titleCaptionKey: 'laundry_home_heavy_1',
                                },
                                {
                                    value: 2,
                                    titleCaptionKey: 'laundry_home_heavy_2',
                                },
                                {
                                    value: 3,
                                    titleCaptionKey: 'laundry_home_heavy_3',
                                },
                                {
                                    value: 4,
                                    titleCaptionKey: 'laundry_home_heavy_4',
                                },
                                {
                                    value: 5,
                                    titleCaptionKey: 'laundry_home_heavy_5',
                                },
                                {
                                    value: 6,
                                    titleCaptionKey: 'laundry_home_heavy_6',
                                },
                                {
                                    value: 7,
                                    titleCaptionKey: 'laundry_home_heavy_7',
                                },
                                {
                                    value: 8,
                                    titleCaptionKey: 'laundry_home_heavy_8',
                                },
                                {
                                    value: 9,
                                    titleCaptionKey: 'laundry_home_heavy_9',
                                },
                                {
                                    value: 10,
                                    titleCaptionKey: 'laundry_home_heavy_10',
                                },
                            ],
                        },
                    ],
                },
                {
                    groupTitle: 'laundry_expressDeliveryTitle',
                    widgets: [
                        {
                            name: 'laundry_express',
                            type: 'option',
                            nameCaptionKey: 'laundry_expressnameCaptionKey',
                            subtitleCaptionKey: 'laundry_expresssubtitleCaptionKey',
                            optionPriceCaption: 'laundry_expresspriceCaptionKey',
                            separated: true,
                        },
                    ],
                },
            ],
        },
    },
    {
        name: 'carpet',
        widgets: {
            main: [
                {
                    name: 'frequency',
                    hidden: true,
                    type: 'select',
                    nameCaptionKey: 'frequency_nameCaptionKey',
                    descriptionCaptionKey: 'frequency_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 'once',
                            captionKey: 'frequency_once',
                        },
                    ],
                },
                {
                    name: 'carpet_items',
                    type: 'dropdownSelectCarpetItems',
                    nameCaptionKey: 'carpet_items_nameCaptionKey',
                    descriptionCaptionKey: 'carpet_items_descriptionCaptionKey',
                    separated: true,
                    options: [
                        {
                            value: 1,
                            captionKey: 'carpet_items__quantity_1',
                        },
                        {
                            value: 2,
                            captionKey: 'carpet_items__quantity_2',
                        },
                        {
                            value: 3,
                            captionKey: 'carpet_items__quantity_3',
                        },
                        {
                            value: 4,
                            captionKey: 'carpet_items__quantity_4',
                        },
                        {
                            value: 5,
                            captionKey: 'carpet_items__quantity_5',
                        },
                    ],
                },
                {
                    name: 'carpet_total_size',
                    type: 'carpetTotalSizeCalculationInput',
                    nameCaptionKey: 'carpet_total_size_nameCaptionKey',
                    descriptionCaptionKey: 'carpet_total_size_descriptionCaptionKey',
                    separated: true,
                    minValue: 1,
                    maxValue: 30,
                },
            ],
            priceFieldMessage: 'carpet_priceFieldMessage',
        },
    },
    {
        name: 'upholstery',
        minOrderValue: 150,
        widgets: {
            main: [
                {
                    name: 'two_seater_sofa_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'two_seater_sofa_quantity_nameCaptionKey',
                    cost: 'two_seater_sofa_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/double_sofa.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'three_seater_sofa_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'three_seater_sofa_quantity_nameCaptionKey',
                    cost: 'three_seater_sofa_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/triple_sofa.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'corner_sofa_5_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'corner_sofa_5_quantity_nameCaptionKey',
                    cost: 'corner_sofa_5_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/corner_sofa_five.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'corner_sofa_7_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'corner_sofa_7_quantity_nameCaptionKey',
                    cost: 'corner_sofa_7_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/corner_sofa_seven.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'single_person_mattress_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'single_person_mattress_quantity_nameCaptionKey',
                    cost: 'single_person_mattress_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/single_mattress.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'single_person_mattress_both_side_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'single_person_mattress_both_side_quantity_nameCaptionKey',
                    cost: 'single_person_mattress_both_side_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/single_mattress.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'double_person_mattress_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'double_person_mattress_quantity_nameCaptionKey',
                    cost: 'double_person_mattress_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/double_mattress.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'double_person_mattress_both_side_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'double_person_mattress_both_side_quantity_nameCaptionKey',
                    cost: 'double_person_mattress_both_side_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/double_mattress.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'armchair_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'armchair_quantity_nameCaptionKey',
                    cost: 'armchair_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/armchair.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'office_chair_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'office_chair_quantity_nameCaptionKey',
                    cost: 'office_chair_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/office_chair.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'stool_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'stool_quantity_nameCaptionKey',
                    cost: 'stool_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/chair_and_stools.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'bed_headboard_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'bed_headboard_quantity_nameCaptionKey',
                    cost: 'bed_headboard_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/headboard_of_bed.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'pouffe_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'pouffe_quantity_nameCaptionKey',
                    cost: 'pouffe_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/pouffe.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                {
                    name: 'pillow_quantity',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'pillow_quantity_nameCaptionKey',
                    cost: 'pillow_quantity_cost',
                    separated: false,
                    icon: 'upholstery_cleaning/pillow.svg',
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                    options: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 4,
                        },
                        {
                            value: 5,
                        },
                    ],
                },
                // {
                //     name: 'car_seat_quantity',
                //     type: 'optionBlockSelect',
                //     nameCaptionKey: 'car_seat_quantity_nameCaptionKey',
                //     cost: 'car_seat_quantity_cost',
                //     separated: false,
                //     icon: 'upholstery_cleaning/car_seat.svg',
                //     buttonColor: {className: 'bg-secondary-upholsteryPink', color: '#FF6487'},
                //     options: [
                //         {
                //             value: 1,
                //         },
                //         {
                //             value: 2,
                //         },
                //         {
                //             value: 3,
                //         },
                //         {
                //             value: 4,
                //         },
                //         {
                //             value: 5,
                //         },
                //     ],
                // },
                // {
                //     name: 'stroller_quantity',
                //     type: 'optionBlockSelect',
                //     nameCaptionKey: 'stroller_quantity_nameCaptionKey',
                //     cost: 'stroller_quantity_cost',
                //     separated: false,
                //     icon: 'upholstery_cleaning/stroller.svg',
                //     buttonColor: {className: 'bg-secondary-upholsteryPink', color: '#FF6487'},
                //     options: [
                //         {
                //             value: 1,
                //         },
                //         {
                //             value: 2,
                //         },
                //         {
                //             value: 3,
                //         },
                //         {
                //             value: 4,
                //         },
                //         {
                //             value: 5,
                //         },
                //     ],
                // },
            ],
            additional: [
                {
                    name: 'animal_hair_existing',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'animal_hair_existing_nameCaptionKey',
                    cost: 'animal_hair_existing_btn_text',
                    separated: false,
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                },
                {
                    name: 'antiallergic_treatment_existing',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'antiallergic_treatment_existing_nameCaptionKey',
                    cost: 'antiallergic_treatment_existing_btn_text',
                    separated: false,
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                },
                {
                    name: 'carpet_impregnation_existing',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'carpet_impregnation_existing_nameCaptionKey',
                    cost: 'carpet_impregnation_existing_btn_text',
                    separated: false,
                    buttonColor: { className: 'bg-secondary-upholsteryPink', color: '#FF6487' },
                },
                {
                    name: 'bad_odors_existing',
                    type: 'optionBlockSelect',
                    nameCaptionKey: 'bad_odors_existing_nameCaptionKey',
                    cost: 'bad_odors_existing_btn_text',
                    separated: false,
                    buttonColor: { className: 'bg-secondary-pink', color: '#FF6487' },
                },
            ],
            priceFieldMessage: 'cleaning_of_furniture_upholstery_priceFieldMessage',
        },
    },
];

export const servicesConfigSwitch = serviceName => {
    switch (serviceName) {
        case 'cleaning':
            return servicesConfigs[0];
        case 'flowers':
            return servicesConfigs[1];
        case 'nails':
            return servicesConfigs[2];
        case 'massage':
            return servicesConfigs[3];
        case 'laundry':
            return servicesConfigs[4];
        case 'carpet':
            return servicesConfigs[5];
        case 'upholstery':
            return servicesConfigs[6];
        default:
            return {};
    }
};

const servicesInitialConfigs = [
    {
        name: 'cleaning',
        config: {
            // General config
            // 0-5
            rooms_quantity: 1,
            // 0-5
            bathrooms_quantity: 1,
            // 0-5
            kitchens_quantity: 1,
            // "once" / "every_week" / "every_two_weeks" / "every_month"
            frequency: 'every_two_weeks',
            // 0-5
            cleaning_additional_hours: 0,

            // Specific config
            // Cleaning:
            // "regular" / "deep"
            plan: 'regular',
            // 25-n
            cleaning_house_size: 60,
            // 0-n
            cleaning_windows_quantity: 0,
            // 0 / 10 / 20 / 30 (batch of 10)
            cleaning_ironing_items: 0,
            // 0-n
            cleaning_balcony_quantity: 0,
            // 0-n
            cleaning_fridge_quantity: 0,
            // 0-n
            cleaning_microwave_quantity: 0,
            // 0-n
            cleaning_oven_quantity: 0,
            // 0-n
            cleaning_kitchen_hood_quantity: 0,
            // 0-n
            cleaning_ventilator_quantity: 0,
            // 0 - 1
            cleaning_dishes_quantity: false,
            // 0 - 1
            cleaning_pets_existing: false,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'flowers',
        config: {
            // General config
            // "once" / "every_week" / "every_two_weeks" / "every_month"
            frequency: 'once',

            // Specific config
            // Flowers:
            // "medium" / "large"
            plan: 'medium',
            // 0-n
            quantity: 1,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'nails',
        config: {
            // General config
            // "once" / "every_week" / "every_two_weeks" / "every_month"
            frequency: 'once',

            // Specific config
            // Nails:
            // "manicure" / "pedicure" / "all"
            plan: 'manicure',
            nails_polishing: false,
            nails_hybrid: false,
            nails_gel: false,
            nails_gel_removal: false,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'massage',
        config: {
            // General config
            // "once" / "every_week" / "every_two_weeks" / "every_month"
            frequency: 'once',

            // Specific config
            // Massage:
            // "relaxation" / "deep_tissue" / "sport" / "physio"
            plan: 'relaxation',
            // 0-3
            quantity: 1,
            // 45 / 90 / 120
            massage_duration: 90,
            // "n" / "f" / "m"
            massage_preferred_therapist_gender: 'n',
            massage_fallback_to_any_gender: true,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'laundry',
        config: {
            // General config
            // "once" / "every_week" / "every_two_weeks" / "every_month"
            frequency: 'once',

            // Specific config
            // Laundry:
            laundry_clothes_light: 0,
            laundry_clothes_medium: 0,
            laundry_clothes_heavy: 0,
            laundry_home_light: 0,
            laundry_home_heavy: 0,
            laundry_express: false,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'carpet',
        config: {
            // General config
            // "once"
            frequency: 'once',

            // Specific config
            // Carpet:
            carpet_items: 1,
            carpets_total_size: 1,
            carpet_detailed_sizes: [1],
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
    {
        name: 'upholstery',
        config: {
            two_seater_sofa_quantity: 0,
            three_seater_sofa_quantity: 0,
            corner_sofa_5_quantity: 0,
            corner_sofa_7_quantity: 0,
            single_person_mattress_quantity: 0,
            single_person_mattress_both_side_quantity: 0,
            double_person_mattress_quantity: 0,
            double_person_mattress_both_side_quantity: 0,
            armchair_quantity: 0,
            office_chair_quantity: 0,
            stool_quantity: 0,
            bed_headboard_quantity: 0,
            pouffe_quantity: 0,
            pillow_quantity: 0,
            // car_seat_quantity: 0,
            // children_stroller_cleaning_quantity: 0,
            animal_hair_existing: false,
            antiallergic_treatment_existing: false,
            carpet_impregnation_existing: false,
            bad_odors_existing: false,
        },
        address: {
            address_id: '',
            address_name: '',
        },
        date_time: {
            mission_date: '',
            frequent_mission_day: '',
            frequent_mission_time: '',
        },
    },
];

export const initialConfigSwitch = serviceName => {
    switch (serviceName) {
        case 'cleaning':
            return servicesInitialConfigs[0];
        case 'flowers':
            return servicesInitialConfigs[1];
        case 'nails':
            return servicesInitialConfigs[2];
        case 'massage':
            return servicesInitialConfigs[3];
        case 'laundry':
            return servicesInitialConfigs[4];
        case 'carpet':
            return servicesInitialConfigs[5];
        case 'upholstery':
            return servicesInitialConfigs[6];
        default:
            return {};
    }
};

const servicesConfigDetails = [
    {
        name: 'cleaning',
        sections: [
            {
                name: 'plan',
            },
            {
                name: 'cleaning_house_size',
            },
            {
                name: 'options',
                options: ['cleaning_windows_quantity', 'cleaning_ironing_items'],
            },
        ],
    },
    {
        name: 'flowers',
        sections: [
            {
                name: 'plan',
            },
            {
                name: 'quantity',
            },
        ],
    },
    {
        name: 'nails',
        sections: [
            {
                name: 'plan',
            },
            {
                name: 'options',
                options: ['nails_polishing', 'nails_hybrid', 'nails_gel', 'nails_gel_removal'],
            },
        ],
    },
    {
        name: 'massage',
        sections: [
            {
                name: 'plan',
            },
            {
                name: 'quantity',
            },
            {
                name: 'massage_duration',
            },
            {
                name: 'massage_preferred_therapist_gender',
            },
        ],
    },
    {
        name: 'laundry',
        sections: [
            {
                name: 'clothes',
                options: ['laundry_clothes_light', 'laundry_clothes_medium', 'laundry_clothes_heavy'],
            },
            {
                name: 'home',
                options: ['laundry_home_light', 'laundry_home_heavy'],
            },
        ],
    },
    {
        name: 'carpet',
        sections: [
            {
                name: 'carpet_items',
            },
            {
                name: 'carpets_total_size',
            },
        ],
    },
    // TODO: Add upholstery_cleaning details and find out how it should be displayed
];

export const servicesDetailsSwitch = serviceName => {
    switch (serviceName) {
        case 'cleaning':
            return servicesConfigDetails[0];
        case 'flowers':
            return servicesConfigDetails[1];
        case 'nails':
            return servicesConfigDetails[2];
        case 'massage':
            return servicesConfigDetails[3];
        case 'laundry':
            return servicesConfigDetails[4];
        case 'carpet':
            return servicesConfigDetails[5];
        default:
            return {};
    }
};
