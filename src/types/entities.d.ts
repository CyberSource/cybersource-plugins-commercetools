declare module 'entities/decode' {
    class EntityDecoder {
        constructor();
        write(input: string): string;
        end(): string;
    }
    export { EntityDecoder };
}
