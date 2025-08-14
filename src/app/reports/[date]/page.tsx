"use client";
import { useParams } from "next/navigation";


export default function Page() {   
    const { date } = useParams();

    return(
        <div>
            <p>
                Report for {date}
            </p>

        </div>
    )
}