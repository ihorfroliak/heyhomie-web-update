import tw, { css, styled, theme } from 'twin.macro';

const Dropdown = styled.select`
    position: relative;

    height: 37px;
    min-width: 5rem;

    text-align: center;
    font-size: 16px;
    font-weight: bold;

    border-radius: 4px;
    border-style: solid;
    border-width: 1px;

    margin-left: 10px;
    padding-left: 10px;
    padding-right: 18px;

    appearance: none;

    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAYAAAA7KqwyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBjY8xDsIwDEVtV+yVEFLHHKNiy1E4adbeAo8du0PyqQekAjaKlyj+fs8yX87XOxFoOCGv66LUUdM0p/qQYpw02MN7g4sFvfCOJWOltpYB0h7JEQagtSGzBeM4p0GkMFNignrnePC2LcrvgX+SCLaMj1s8ifUj+EfgSWwkgl3Bt8T+ERwKPiXQZ8XNg61e6xiT9os2hqgAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-position: right 10px top 50%;

    ${tw`
        border-primary-dark text-primary-dark
    `}

    &:disabled {
        ${tw`
            border-primary-grey text-primary-grey
        `}
    }

    option {
        ${tw`
            border-primary-dark text-primary-dark
        `}
        text-align: center;
        font-size: 16px;
        font-weight: bold;

        display: flex;
        white-space: pre;
        padding: 0px 2px 1px;
    }
`;

export default Dropdown;
