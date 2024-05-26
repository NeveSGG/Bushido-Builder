import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const LoadingSkeleton = () => {
    return (
        <Stack
            display="flex"
            flexDirection="column"
            gap="10px"
            width="100%"
            height="100vh"
            alignItems="center"
            justifyContent="center"
        >
            <Skeleton variant="rounded" width={500} height={60} />
            <Skeleton variant="rounded" width={500} height={60} />
            <Skeleton variant="rounded" width={500} height={60} />
        </Stack>
    )
}

export default LoadingSkeleton
