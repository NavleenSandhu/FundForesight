import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { RootState } from "@/store/store"
import { displayDate } from "@/utils/dateUtils"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

function BudgetsOverview() {
    const { budgets, error } = useSelector((state: RootState) => state.budgets)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if(error === "Unauthorized"){
            navigate("/auth/register")
        }
    }, [error, navigate])
    
    return (
        <Card className="px-8">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-primary">Budgets</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel>
                    <CarouselContent>
                        {budgets.map((budget) => (
                            <CarouselItem key={budget.budget_id}>
                                <Card className="shadow-md p-4 space-y-2">
                                    <h3 className="text-lg font-bold">{budget.category_name}</h3>
                                    <div className="grid grid-cols-1 px-2 md:grid-cols-2">
                                        <div className="md:text-left">
                                            <p>
                                                ${budget.remaining_amount}/
                                                ${budget.initial_amount}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground md:text-right">
                                            Ends on {displayDate(budget.end_date)}
                                        </p>
                                    </div>
                                    <Button onClick={() => { navigate("/dashboard/budgets/viewBudget", { state: { budget_id: budget.budget_id, referer: location.pathname } }) }}>View</Button>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </CardContent>
        </Card>
    )
}

export default BudgetsOverview
