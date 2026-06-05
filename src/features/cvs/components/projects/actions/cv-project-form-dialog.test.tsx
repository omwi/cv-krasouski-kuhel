import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CvProjectFormValues } from "@/features/cvs/components/projects/actions/cv-project-schema"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { Project } from "@/types/graphql-types"

import CvProjectFormDialog from "./cv-project-form-dialog"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/projects/components/project-select", () => ({
  default: vi.fn(({ value, onValueChange, disabled, excludedNames }) => (
    <div data-testid="project-select" data-disabled={disabled}>
      <span data-testid="project-value">{value}</span>
      <button
        data-testid="project-change"
        onClick={() => onValueChange("new-proj-id")}
      />
      <span data-testid="project-excluded">{excludedNames.join(",")}</span>
    </div>
  )),
}))

vi.mock("@/components/shared/form/form-date-range-picker", () => ({
  FormDateRangePicker: vi.fn(({ startName, endName }) => (
    <div data-testid="date-range-picker">
      <span>{startName}</span>
      <span>{endName}</span>
    </div>
  )),
}))

vi.mock("@/components/shared/select/environment-select", () => ({
  EnvironmentSelect: vi.fn(({ value, disabled }) => (
    <div data-testid="environment-select" data-disabled={disabled}>
      {value.join(",")}
    </div>
  )),
}))

vi.mock("@/components/shared/input/floating-badge-input", () => ({
  default: vi.fn(({ value, onValueChange, id }) => (
    <div data-testid="floating-badge-input" data-id={id}>
      <span data-testid="badge-value">{value.join(",")}</span>
      <button
        data-testid="badge-change"
        onClick={() => onValueChange(["resp-1", "resp-2"])}
      />
    </div>
  )),
}))

const TestWrapper = ({
  open = true,
  isUpdate = false,
  selectedProject,
  onSubmit = vi.fn(),
  formValues,
}: {
  open?: boolean
  isUpdate?: boolean
  selectedProject?: Project
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>
  formValues?: CvProjectFormValues | null
}) => {
  const form = useForm({
    defaultValues: formValues || {
      projectId: "proj-1",
      responsibilities: ["orig-resp"],
      startDate: "2021-01-01",
      endDate: null,
    },
  })

  return (
    <CvProjectFormDialog
      open={open}
      onOpenChange={vi.fn()}
      title="Test Dialog"
      submitLabel="Submit Now"
      onSubmit={onSubmit}
      isSubmitReady={true}
      form={form}
      selectedProject={selectedProject}
      cvId="cv-123"
      isUpdate={isUpdate}
    />
  )
}

describe("CvProjectFormDialog", () => {
  const mockCvProjects = [
    { id: "cs-1", name: "Existing Project 1" },
    { id: "cs-2", name: "Existing Project 2" },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          projects: mockCvProjects,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)
  })

  it("should render all inputs and display prefilled info for a selected project", () => {
    const mockSelectedProject = {
      id: "p-1",
      name: "E-Commerce",
      domain: "E-Commerce Domain",
      description: "E-Commerce Description",
      environment: ["React", "CSS"],
    } as unknown as Project

    render(<TestWrapper selectedProject={mockSelectedProject} />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(GET_CV_PROJECTS, {
      variables: { cvId: "cv-123" },
    })

    // ProjectSelect check
    expect(screen.getByTestId("project-select")).toBeInTheDocument()
    expect(screen.getByTestId("project-select")).toHaveAttribute(
      "data-disabled",
      "false"
    )
    expect(screen.getByTestId("project-value")).toHaveTextContent("proj-1")
    expect(screen.getByTestId("project-excluded")).toHaveTextContent(
      "Existing Project 1,Existing Project 2"
    )

    // Domain (readonly) check
    expect(screen.getByLabelText("domain")).toHaveValue("E-Commerce Domain")
    expect(screen.getByLabelText("domain")).toHaveAttribute("readonly")

    // DateRangePicker check
    expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()

    // Description (readonly text area) check
    expect(screen.getByLabelText("description")).toHaveValue(
      "E-Commerce Description"
    )
    expect(screen.getByLabelText("description")).toHaveAttribute("readonly")

    // EnvironmentSelect check
    expect(screen.getByTestId("environment-select")).toBeInTheDocument()
    expect(screen.getByTestId("environment-select")).toHaveAttribute(
      "data-disabled",
      "true"
    )
    expect(screen.getByTestId("environment-select")).toHaveTextContent(
      "React,CSS"
    )

    // FloatingBadgeInput check
    expect(screen.getByTestId("floating-badge-input")).toBeInTheDocument()
    expect(screen.getByTestId("badge-value")).toHaveTextContent("orig-resp")
  })

  it("should disable ProjectSelect and clear excluded names when isUpdate is true", () => {
    render(<TestWrapper isUpdate={true} />)

    expect(screen.getByTestId("project-select")).toHaveAttribute(
      "data-disabled",
      "true"
    )
    expect(screen.getByTestId("project-excluded")).toHaveTextContent("")
  })

  it("should trigger onSubmit when submitted", async () => {
    const mockOnSubmit = vi.fn().mockImplementation((e) => {
      e?.preventDefault()
      return Promise.resolve()
    })

    render(<TestWrapper onSubmit={mockOnSubmit} />)

    const formElement = screen.getByTestId("form-dialog")
    formElement.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should fallback to default arrays when projects or responsibilities are null", () => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          projects: null,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(
      <TestWrapper
        formValues={{
          projectId: "proj-1",
          responsibilities: null as unknown as string[],
          startDate: "2021-01-01",
          endDate: null,
        }}
      />
    )

    // excluded names should be empty
    expect(screen.getByTestId("project-excluded")).toHaveTextContent("")
    // badge value should be empty
    expect(screen.getByTestId("badge-value")).toHaveTextContent("")
  })
})
