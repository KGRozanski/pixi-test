export interface Key {
    value: string;
    isDown: boolean;
    isUp: boolean;
    press: any,
    release: any,
    downHandler: EventListenerOrEventListenerObject,
    upHandler: EventListenerOrEventListenerObject,
    unsubscribe: Function
}

export function keyFactory(value: string): Key {
    let key: Key = {
        value: value,
        isDown: false,
        isUp: true,
        press: undefined,
        release: undefined,
        downHandler: (event: any) => {
            if (event.key === key.value) {
                if (key.isUp && key.press) {
                    key.press();
                }
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        },
        upHandler: (event: any) => {
            if (event.key === key.value) {
                if (key.isDown && key.release) {
                    key.release();
                }
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        },
        // Detach event listeners
        unsubscribe: () => {
            window.removeEventListener("keydown", key.downHandler);
            window.removeEventListener("keyup", key.upHandler);
        }
    };

    window.addEventListener("keydown", key.downHandler, false);
    window.addEventListener("keyup", key.upHandler, false);


    return key;
}