import { StateInfo } from './StateInfo';
import { stateInfoPresets } from './StateInfoPresets';

interface StateInfoWrapperProps {
    preset: keyof typeof stateInfoPresets;
    onRetry?: () => void;
    className?: string;
    onClick?: () => void;
}

export const StateInfoWrapper = ({ preset, onRetry, className }: StateInfoWrapperProps) => {
    const { type, title, description } = stateInfoPresets[preset];
    return (
        <StateInfo
            type={type}
            title={title}
            description={description}
            onRetry={onRetry}
            className={className}
        />
    );
};
