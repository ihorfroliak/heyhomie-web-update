import Image from 'next/image';

function Arrow({ disabled, onClick, left = false }) {
    return (
        <div className={`absolute top-3.5 ${disabled && 'opacity-40'} ${left ? 'left-0' : 'right-0'}`} onClick={onClick}>
            {left ? (
                <Image src='/icons/services_arrow_left.svg' width={25} height={80} alt='Change arrow slide' />
            ) : (
                <Image src='/icons/services_arrow_right.svg' width={25} height={80} alt='Change arrow slide' />
            )}
        </div>
    );
}

export default Arrow;
