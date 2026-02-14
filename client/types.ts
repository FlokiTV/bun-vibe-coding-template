import type { JSX } from "react/jsx-runtime";

export type Routes = {
    path: string;
    component: () => JSX.Element;
}[]