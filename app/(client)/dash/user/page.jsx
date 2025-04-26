import HealthDropdown from "@/components/user/health-dropdown/HealthDropdown"
import AccountDropdown from "@/components/user/account-dropdown/AccountDropdown"
import Image from "next/image"

export default function Profile() {
    return (
        <section className="w-full px-2">
            {/* dropdown menu container */}
            <div className="bg-[var(--background-darker)] rounded-2xl">
                <HealthDropdown />
                {/* <AccountDropdown /> hujzin vecit nebus laika */}
                <div className="flex flex-col w-full p-4 border-top">
                    <button className="flex flex-row justify-between items-center cursor-pointer py-4">
                        <p className="paragraph">Log out</p>
                        <Image src="/logout.svg" height={32} width={32} alt="logout"/>
                    </button>
                </div>
            </div>
        </section>
    )
}