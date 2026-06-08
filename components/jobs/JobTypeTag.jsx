import Badge, { getJobTypeBadge, getLocationBadge } from "../ui/Badge";

export function JobTypeTag({ type }) {
  return (
    <Badge variant={getJobTypeBadge(type)} className="capitalize">
      {type?.replace("-", " ")}
    </Badge>
  );
}

export function LocationTag({ type }) {
  return (
    <Badge variant={getLocationBadge(type)} className="capitalize">
      {type}
    </Badge>
  );
}
