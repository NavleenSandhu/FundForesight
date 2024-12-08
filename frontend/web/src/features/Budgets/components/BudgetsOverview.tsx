import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { RootState } from "@/store/store"
import { displayDate } from "@/utils/dateUtils"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

function BudgetsOverview() {
    const { budgets, loading, error } = useSelector((state: RootState) => state.budgets)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (error === "Unauthorized") {
            navigate("/auth/login")
        }
    }, [error, navigate])

    return (
        <Card className="px-8">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-primary">Budgets</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && budgets.length === 0 ? (
                    // Case 1: Loading and no current budgets -> Show skeleton
                    <div className="flex flex-col items-center">
                        <div className="w-24">
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="w-16">
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="w-16">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="w-24">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ) : !loading && budgets.length === 0 ? (
                    // Case 2: Success and budgets length is 0 -> Show no budgets created
                    <div className="text-center text-muted-foreground">
                        No budgets created.{" "}
                        <Link
                            to="/dashboard/budgets">Create Budget</Link>
                    </div>
                ) : (
                    // Case 3: Show budgets
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
                                        <Button
                                            onClick={() =>
                                                navigate("/dashboard/budgets/viewBudget", {
                                                    state: {
                                                        budget_id: budget.budget_id,
                                                        referer: location.pathname,
                                                    },
                                                })
                                            }
                                        >
                                            View
                                        </Button>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}
            </CardContent>
        </Card>
    )
}

export default BudgetsOverview
