import {Button, Flex, Text} from "@radix-ui/themes";

export default function ReplayControls({playing, canStep, onPlay, onPause, onStep, onRestart}: {
    playing: boolean;
    canStep: boolean;
    onPlay: () => void;
    onPause: () => void;
    onStep: () => void;
    onRestart: () => void;
}) {
    return (
        <Flex align="center" gap="2" wrap="wrap" className="poker-replay-controls">
            {playing ? (
                <Button type="button" variant="soft" onClick={onPause}>Pause</Button>
            ) : (
                <Button type="button" onClick={onPlay}>Play</Button>
            )}
            <Button type="button" variant="soft" disabled={!canStep} onClick={onStep}>Step</Button>
            <Button type="button" variant="surface" onClick={onRestart}>Restart</Button>
            <Text size="2" color="gray">Replay controls for the parsed hand history.</Text>
        </Flex>
    );
}
