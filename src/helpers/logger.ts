export class Logger {
    static log(text: string) {
        console.log(text);
    }

    static success(text: string) {
        console.log(`<span style='color:#87A96B'>${text}</span>`);
    }

    static warn(text: string) {
        console.log(`<span style='color:#FEBE10'>${text}</span>`);
    }

    static danger(text: string) {
        console.log(`<span style='color:#fd5c63'>${text}</span>`);
    }

    static info(text: string) {
        console.log(`<span style='color:#72A0C1'>${text}</span>`);
    }
}
