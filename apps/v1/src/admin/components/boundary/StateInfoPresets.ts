interface StateInfoPresets {
    type: 'error' | 'empty';
    title: string;
    description?: string;
}

export const stateInfoPresets: Record<'defaultError' | 'emptyTable' | 'notFound' | 'unauthorized', StateInfoPresets> = {
    defaultError: {
        type: 'error',
        title: '문제가 발생했어요',
        description: '요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    },
    emptyTable: {
        type: 'empty',
        title: '표시할 데이터가 없어요',
        description: '조건을 다시 확인하거나 새로운 항목을 추가해 보세요.',
    },
    notFound: {
        type: 'error',
        title: '찾을 수 없어요',
        description: '해당 정보가 존재하지 않거나 삭제되었어요.',
    },
    unauthorized: {
        type: 'error',
        title: '접근 권한이 없어요',
        description: '로그인 후 다시 시도해 주세요.',
    },
};
