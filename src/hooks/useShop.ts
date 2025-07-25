"use client";

import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/user";
import { useGridStore } from "@/store/grid"; // <-- added
import { ShopItem } from "@/types/shop/shopItem";
import { Items } from "@/data/shop";

const initialState: { [key: string]: number } = {
    coininvestori: 0,
    coininvestorii: 0,
    coininvestoriii: 0,
    coininvestoriv: 0,
    owlicon: 0,
    tigericon: 0,
    sharkicon: 0,
    cheetahicon: 0,
    bronzebanner: 0,
    goldbanner: 0,
    emeraldbanner: 0,
    diamondbanner: 0,
};

function reducer(
    state: typeof initialState,
    action: { type: string; payload?: string; matchedItem?: ShopItem }
) {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                [action.payload as string]: state[action.payload as string] + 1,
            };
        case "decrement":
            return {
                ...state,
                [action.payload as string]: Math.max(
                    0,
                    state[action.payload as string] - 1
                ),
            };
        default:
            return state;
    }
}

export const useShop = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const grid = useGridStore((state) => state.grid);

    const [coins, setCoins] = useState({ amnt: -1 });
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const handleGetUserAuth = async () => {
            try {
                // TEMP FOR NOW 
                const userResponse = await axios.get("/api/auth/get-user");

                const response = await axios.get("/api/auth/view-currency");
            
                setUser?.(userResponse.data.user);
                setCoins({ amnt: response.data.user?.currency });
            } catch (error) {
                console.error("Error fetching user:", (error as Error).message);
            }
        };

        handleGetUserAuth();
    }, [setUser]);

    const handleDispatch = (type: "increment" | "decrement", payload: string) => {
        const matchedItem = Items[grid]?.find(
            (item) => item.name.toLowerCase().replace(/\s/g, "") === payload
        );

        if (matchedItem) {
            if (type === "increment") {
                setCoins((prev) => ({ amnt: prev.amnt - matchedItem.price }));
            } else {
                setCoins((prev) => ({ amnt: prev.amnt + matchedItem.price }));
            }
        }

        dispatch({ type, payload });
    };

    return {
        coins,
        setCoins,
        state,
        user,
        handleDispatch,
    };
}
